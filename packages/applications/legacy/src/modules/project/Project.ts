import { DomainEvent, EventStoreAggregate, UniqueEntityID } from '../../core/domain';
import {
  err,
  isPositiveNumber,
  isStrictlyPositiveNumber,
  makePropertyValidator,
  ok,
  Result,
} from '../../core/utils';
import { ProjectAppelOffre, User, CahierDesChargesRéférenceParsed } from '../../entities';
import { isNotifiedPeriode } from '../../entities/periode';
import { getDelaiDeRealisation, GetProjectAppelOffre } from '../projectAppelOffre';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { add, sub } from 'date-fns';
import remove from 'lodash/remove';
import sanitize from 'sanitize-filename';
import { BuildProjectIdentifier, DésignationCatégorie } from '.';
import { shallowDelta } from '../../helpers/shallowDelta';
import {
  EntityNotFoundError,
  HeterogeneousHistoryError,
  IllegalInitialStateForAggregateError,
  IncompleteDataError,
} from '../shared';
import { ProjectDataForCertificate } from './dtos';
import {
  IllegalProjectStateError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
  ProjectNotEligibleForCertificateError,
} from './errors';
import {
  AppelOffreProjetModifié,
  CovidDelayGranted,
  IdentifiantPotentielPPE2Batiment2Corrigé,
  LegacyProjectSourced,
  ProjectAbandoned,
  ProjectActionnaireUpdated,
  ProjectClasseGranted,
  ProjectCompletionDueDateCancelled,
  ProjectCompletionDueDateSet,
  ProjectDataCorrected,
  ProjectDataCorrectedPayload,
  ProjectDCRDueDateCancelled,
  ProjectDCRDueDateSet,
  ProjectFournisseursUpdated,
  ProjectImported,
  ProjectNotificationDateSet,
  ProjectNotified,
  ProjectProducteurUpdated,
  ProjectPuissanceUpdated,
  ProjectReimported,
  CahierDesChargesChoisi,
  LegacyAbandonSupprimé,
  AbandonProjetAnnulé,
  ProjectRawDataImportedPayload,
} from './events';
import { toProjectDataForCertificate } from './mappers';

export interface Project extends EventStoreAggregate {
  import: (args: {
    appelOffre: ProjectAppelOffre;
    data: ProjectRawDataImportedPayload['data'];
    importId: string;
  }) => Result<null, IllegalProjectStateError | EntityNotFoundError>;
  correctData: (
    user: User,
    data: ProjectDataCorrectedPayload['correctedData'],
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectStateError>;
  setCompletionDueDate: (args: {
    appelOffre: ProjectAppelOffre;
    completionDueOn: number;
  }) => Result<null, never>;

  readonly isClasse?: boolean;
  readonly isLegacy?: boolean;
  readonly abandonedOn: number;
  readonly puissanceInitiale: number;
  readonly certificateData: Result<
    {
      template: AppelOffre.CertificateTemplate;
      data: ProjectDataForCertificate;
    },
    | IncompleteDataError
    | ProjectNotEligibleForCertificateError
    | IllegalInitialStateForAggregateError
  >;
  readonly certificateFilename: string;
  readonly data: ProjectDataProps | undefined;
  readonly cahierDesCharges: CahierDesChargesRéférenceParsed;
  readonly appelOffreId: string;
  readonly periodeId: string;
  readonly familleId?: string;
  readonly completionDueOn: number;
  readonly identifiantGestionnaireRéseau: string;
  readonly dateMiseEnService?: Date;
  readonly dateFileAttente?: Date;
  readonly délaiCDC2022appliqué: boolean;
  readonly dcrDueOn?: Date;
  readonly notifiedOn: number;
  readonly identifiantProjet: string;
}

export interface ProjectDataProps {
  numeroCRE: string;
  appelOffreId: string;
  periodeId: string;
  familleId: string;
  nomProjet: string;
  territoireProjet: string;
  puissance: number;
  prixReference: number;
  evaluationCarbone: number;
  note: number;
  nomCandidat: string;
  nomRepresentantLegal: string;
  email: string;
  adresseProjet: string;
  codePostalProjet: string;
  communeProjet: string;
  engagementFournitureDePuissanceAlaPointe: boolean;
  isFinancementParticipatif: boolean;
  isInvestissementParticipatif: boolean;
  motifsElimination: string;
  details: Record<string, string>;
  technologie: AppelOffre.Technologie;
  actionnariat?: 'financement-collectif' | 'gouvernance-partagee';
  classe: 'Classé' | 'Eliminé';
  désignationCatégorie?: DésignationCatégorie;
}

export interface ProjectProps {
  projectId: UniqueEntityID;
  appelOffre?: ProjectAppelOffre;
  notifiedOn: number;
  abandonedOn: number;
  completionDueOn: number;
  hasCompletionDueDateMoved: boolean;
  lastUpdatedOn?: Date;
  hasError: boolean;
  isClasse?: boolean;
  puissanceInitiale: number;
  data: ProjectDataProps | undefined;
  cahierDesCharges: CahierDesChargesRéférenceParsed;
  fieldsUpdatedAfterImport: Set<string>;
  potentielIdentifier?: string;
  appelOffreId: string;
  periodeId: string;
  familleId: string;
  identifiantGestionnaireRéseau: string;
  dateMiseEnService: Date | undefined;
  dateFileAttente: Date | undefined;
  délaiCDC2022appliqué: boolean;
  dcrDueOn: Date | undefined;
  identifiantProjet: string;
}

const projectValidator = makePropertyValidator({
  puissance: isStrictlyPositiveNumber,
  prixReference: isPositiveNumber,
  note: isPositiveNumber,
  evaluationCarbone: isPositiveNumber,
});

export const makeProject = (args: {
  projectId: UniqueEntityID;
  history?: DomainEvent[];
  getProjectAppelOffre: GetProjectAppelOffre;
  buildProjectIdentifier: BuildProjectIdentifier;
}): Result<Project, EntityNotFoundError | HeterogeneousHistoryError> => {
  const { history, projectId, getProjectAppelOffre, buildProjectIdentifier } = args;

  if (!_allEventsHaveSameAggregateId()) {
    return err(new HeterogeneousHistoryError());
  }

  const pendingEvents: DomainEvent[] = [];
  const props: ProjectProps = {
    notifiedOn: 0,
    abandonedOn: 0,
    completionDueOn: 0,
    hasCompletionDueDateMoved: false,
    projectId,
    puissanceInitiale: 0,
    data: undefined,
    hasError: false,
    cahierDesCharges: { type: 'initial' },
    fieldsUpdatedAfterImport: new Set<string>(),
    potentielIdentifier: '',
    appelOffreId: '',
    periodeId: '',
    familleId: '',
    identifiantGestionnaireRéseau: '',
    dateMiseEnService: undefined,
    dateFileAttente: undefined,
    délaiCDC2022appliqué: false,
    dcrDueOn: undefined,
    identifiantProjet: '',
  };

  // Initialize aggregate by processing each event in history
  if (history) {
    if (history.length === 0) {
      return err(new EntityNotFoundError());
    }

    for (const event of history) {
      _processEvent(event);

      if (props.hasError) {
        const errorMessage = `Problème lors du traitement de l'événement ${event.type} par _ProcessEvent pour le projet ${projectId}`;
        return err(new IllegalInitialStateForAggregateError({ projectId, errorMessage }));
      }
    }

    _updateAppelOffre({
      appelOffreId: props.appelOffreId,
      periodeId: props.periodeId,
      familleId: props.familleId,
    });
  }

  // public methods
  return ok({
    import: function ({ appelOffre, data, importId }) {
      const { appelOffreId, periodeId, familleId, numeroCRE } = data;

      const id = projectId.toString();

      if (_isNew()) {
        _publishEvent(
          new ProjectImported({
            payload: {
              projectId: id,
              appelOffreId,
              periodeId,
              familleId,
              numeroCRE,
              importId,
              data: {
                ...data,
                ...(appelOffre.isSoumisAuxGF && { soumisAuxGF: true }),
              },
              potentielIdentifier: buildProjectIdentifier({
                appelOffreId,
                periodeId,
                familleId,
                numeroCRE,
              }),
            },
          }),
        );

        if (data.notifiedOn) {
          try {
            isStrictlyPositiveNumber(data.notifiedOn);
          } catch (e) {
            return err(new IllegalProjectStateError({ notifiedOn: e.message }));
          }

          _publishNewNotificationDate({
            projectId: id,
            notifiedOn: data.notifiedOn,
            setBy: '',
          });

          _updateDCRDate(appelOffre);
          _updateCompletionDate(appelOffre);
        }
      } else {
        const changes = _computeDelta(data);

        for (const updatedField of props.fieldsUpdatedAfterImport) {
          if (updatedField.startsWith('details.') && changes.details) {
            delete changes.details[updatedField.substring('details.'.length)];
            continue;
          }
          delete changes[updatedField];
        }
        delete changes['notifiedOn'];

        const hasNotificationDateChanged = data.notifiedOn && data.notifiedOn !== props.notifiedOn;

        if (Object.keys(changes).length) {
          _publishEvent(
            new ProjectReimported({
              payload: {
                projectId: id,
                appelOffreId,
                periodeId,
                familleId,
                importId,
                data: changes,
              },
            }),
          );
        }

        if (hasNotificationDateChanged) {
          _publishNewNotificationDate({
            projectId: id,
            notifiedOn: data.notifiedOn,
            setBy: '',
          });
        }

        if (props.notifiedOn) {
          if (changes.classe) {
            if (data.classe === 'Classé') {
              // éliminé -> classé
              _updateDCRDate(appelOffre);
              _updateCompletionDate(appelOffre);
            } else if (data.classe === 'Eliminé') {
              // classé -> eliminé
              _cancelDCRDate();
              _cancelCompletionDate();
            }
          } else {
            if (props.isClasse) {
              if (hasNotificationDateChanged) {
                // remains classé
                _updateDCRDate(appelOffre);
                _updateCompletionDate(appelOffre);
              }
            }
            // remains éliminé
          }
        }

        if (changes.technologie) {
          _updateCompletionDate(appelOffre);
        }
      }

      return ok(null);
    },
    correctData: function (user, corrections) {
      if (!_isNotified() || !props.data) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError());
      }

      const changes = _computeDelta(corrections);

      if (!changes || !Object.keys(changes).length) {
        return ok(null);
      }

      return _validateProjectFields(changes).andThen(() => {
        _publishEvent(
          new ProjectDataCorrected({
            payload: {
              projectId: props.projectId.toString(),
              correctedBy: user.id,
              correctedData: changes,
            },
          }),
        );
        return ok(null);
      });
    },
    setCompletionDueDate: function ({ appelOffre, completionDueOn }) {
      _updateCompletionDate(appelOffre, {
        completionDueOn,
      });

      return ok(null);
    },

    get pendingEvents() {
      return pendingEvents;
    },
    get lastUpdatedOn() {
      return props.lastUpdatedOn;
    },
    get isClasse() {
      return props.isClasse;
    },
    get isLegacy() {
      return props.appelOffre && props.appelOffre.periode.type === 'legacy';
    },
    get puissanceInitiale() {
      return props.puissanceInitiale;
    },
    get certificateData() {
      if (!props.appelOffre) {
        const errorMessage = `Appel d'offre inaccessible dans project.addGeneratedCertificate pour le project ${projectId}`;
        return err(
          new IllegalInitialStateForAggregateError({ projectId, errorMessage }),
        ) as Project['certificateData'];
      }

      const { periode } = props.appelOffre;
      if (!isNotifiedPeriode(periode) || !periode.certificateTemplate || !props.notifiedOn) {
        return err(new ProjectNotEligibleForCertificateError()) as Project['certificateData'];
      }

      return toProjectDataForCertificate(props).map((data) => ({
        template: periode.certificateTemplate,
        data,
      }));
    },
    get certificateFilename() {
      const { appelOffre, data, potentielIdentifier } = props;

      if (!appelOffre || !data || !potentielIdentifier) return 'attestation.pdf';

      const { nomProjet } = data;

      return sanitize(`${potentielIdentifier}-${nomProjet}.pdf`);
    },
    get id() {
      return projectId;
    },
    get identifiantProjet() {
      return props.identifiantProjet;
    },
    get data() {
      return props.data;
    },
    get cahierDesCharges() {
      return props.cahierDesCharges;
    },
    get appelOffreId() {
      return props.appelOffreId;
    },
    get periodeId() {
      return props.periodeId;
    },
    get familleId() {
      return props.familleId;
    },
    get completionDueOn() {
      return props.completionDueOn;
    },
    get abandonedOn() {
      return props.abandonedOn;
    },
    get identifiantGestionnaireRéseau() {
      return props.identifiantGestionnaireRéseau;
    },
    get dateMiseEnService() {
      return props.dateMiseEnService;
    },
    get dateFileAttente() {
      return props.dateFileAttente;
    },
    get délaiCDC2022appliqué() {
      return props.délaiCDC2022appliqué;
    },
    get notifiedOn() {
      return props.notifiedOn;
    },
  });

  // private methods
  function _validateProjectFields(
    newProps: Partial<ProjectDataProps>,
  ): Result<Partial<ProjectDataProps>, IllegalProjectStateError> {
    const errorsInFields = projectValidator(newProps);

    if ('familleId' in newProps) {
      const { appelOffreId, periodeId } = { ...props.data, ...newProps };

      if (!appelOffreId || !periodeId) {
        errorsInFields.appelOffre = "Ce projet n'est associé à aucun appel d'offres";
      } else {
        if (!getProjectAppelOffre({ appelOffreId, periodeId, familleId: newProps.familleId })) {
          // Can't find family in appelOffre
          errorsInFields.familleId = "Cette famille n'existe pas pour cet appel d'offres";
        }
      }
    }

    if (Object.keys(errorsInFields).length) {
      return err(new IllegalProjectStateError(errorsInFields));
    }

    return ok(newProps);
  }

  function _publishEvent(event: DomainEvent) {
    pendingEvents.push(event);
    _processEvent(event);
  }

  function _updateLastUpdatedOn(event: DomainEvent) {
    // only update lastUpdatedOn date for events that mutate the entity
    switch (event.type) {
      case LegacyProjectSourced.type:
      case ProjectImported.type:
      case ProjectReimported.type:
      case ProjectNotified.type:
      case ProjectNotificationDateSet.type:
      case ProjectCompletionDueDateSet.type:
      case ProjectDataCorrected.type:
      case ProjectClasseGranted.type:
        props.lastUpdatedOn = event.occurredAt;
        break;
      default:
        // ignore other event types
        break;
    }
  }

  function _processEvent(event: DomainEvent) {
    switch (event.type) {
      case LegacyProjectSourced.type:
        props.data = event.payload.content;
        props.notifiedOn = event.payload.content.notifiedOn;
        props.puissanceInitiale = event.payload.content.puissance;
        props.potentielIdentifier = event.payload.potentielIdentifier;
        _updateClasse(event.payload.content.classe);
        props.appelOffreId = event.payload.appelOffreId;
        props.periodeId = event.payload.periodeId;
        props.familleId = event.payload.familleId;
        break;
      case ProjectImported.type:
        props.data = event.payload.data;
        props.puissanceInitiale = event.payload.data.puissance;
        props.potentielIdentifier = event.payload.potentielIdentifier;
        _updateClasse(event.payload.data.classe);

        const { appelOffreId, periodeId, familleId, numeroCRE } = event.payload.data;
        props.identifiantProjet = `${appelOffreId}#${periodeId}#${familleId}#${numeroCRE}`;
        props.appelOffreId = appelOffreId;
        props.periodeId = periodeId;
        props.familleId = familleId;
        break;
      case ProjectReimported.type:
        props.data = { ...props.data, ...event.payload.data };
        if (event.payload.data.puissance) {
          props.puissanceInitiale = event.payload.data.puissance;
        }
        if (event.payload.data.classe) {
          _updateClasse(event.payload.data.classe);
        }
        break;
      case ProjectNotified.type:
      case ProjectNotificationDateSet.type:
        props.notifiedOn = event.payload.notifiedOn;
        props.fieldsUpdatedAfterImport.add('notifiedOn');
        break;
      case ProjectCompletionDueDateSet.type:
        if (props.completionDueOn !== 0) props.hasCompletionDueDateMoved = true;
        props.completionDueOn = event.payload.completionDueOn;
        if (event.payload.reason === 'délaiCdc2022') {
          props.délaiCDC2022appliqué = true;
        }
        if (
          event.payload.reason &&
          [
            'ChoixCDCAnnuleDélaiCdc2022',
            'DateMiseEnServiceAnnuleDélaiCdc2022',
            'DemandeComplèteRaccordementTransmiseAnnuleDélaiCdc2022',
          ].includes(event.payload.reason)
        ) {
          props.délaiCDC2022appliqué = false;
        }
        break;
      case CovidDelayGranted.type:
        if (props.completionDueOn !== 0) props.hasCompletionDueDateMoved = true;
        props.completionDueOn = event.payload.completionDueOn;
        break;
      case ProjectDataCorrected.type:
        props.data = { ...props.data, ...event.payload.correctedData } as ProjectProps['data'];
        for (const updatedField of Object.keys(event.payload.correctedData)) {
          props.fieldsUpdatedAfterImport.add(updatedField);
        }
        break;
      case ProjectClasseGranted.type:
        props.isClasse = true;
        props.data = {
          ...props.data,
          classe: 'Classé',
        } as ProjectProps['data'];
        props.fieldsUpdatedAfterImport.add('classe');
        break;
      case ProjectActionnaireUpdated.type:
        props.data = {
          ...props.data,
          actionnaire: event.payload.newActionnaire,
        } as ProjectProps['data'];
        props.fieldsUpdatedAfterImport.add('actionnaire');
        break;
      case ProjectProducteurUpdated.type:
        props.data = {
          ...props.data,
          nomCandidat: event.payload.newProducteur,
        } as ProjectProps['data'];
        props.fieldsUpdatedAfterImport.add('nomCandidat');
        break;
      case ProjectPuissanceUpdated.type:
        props.data = {
          ...props.data,
          puissance: event.payload.puissance,
        } as ProjectProps['data'];
        props.fieldsUpdatedAfterImport.add('puissance');
        break;
      case ProjectFournisseursUpdated.type:
        props.data = {
          ...props.data,
          details: {
            ...props.data?.details,
            ...event.payload.newFournisseurs.reduce(
              (fournisseurs, { kind, name }) => ({ ...fournisseurs, [kind]: name }),
              {},
            ),
          },
        } as ProjectProps['data'];

        for (const { kind } of event.payload.newFournisseurs) {
          props.fieldsUpdatedAfterImport.add(`details.${kind}`);
        }

        break;
      case ProjectAbandoned.type:
        props.abandonedOn = event.occurredAt.getTime();
        break;
      case LegacyAbandonSupprimé.type:
      case AbandonProjetAnnulé.type:
        props.abandonedOn = 0;
        break;
      case AppelOffreProjetModifié.type:
        props.appelOffreId = event.payload.appelOffreId;
        break;
      case IdentifiantPotentielPPE2Batiment2Corrigé.type:
        props.potentielIdentifier = event.payload.nouvelIdentifiant;
        break;
      case CahierDesChargesChoisi.type:
        props.cahierDesCharges = {
          type: event.payload.type,
          ...(event.payload.type === 'modifié' && {
            paruLe: event.payload.paruLe,
            alternatif: event.payload.alternatif,
          }),
        };
        break;
      case ProjectDCRDueDateSet.type:
        props.dcrDueOn = new Date(event.payload.dcrDueOn);
        break;
      default:
        // ignore other event types
        break;
    }

    _updateLastUpdatedOn(event);
  }

  function _isNew() {
    return !history;
  }

  function _isNotified() {
    return !!props.notifiedOn;
  }

  function _updateAppelOffre(args: {
    appelOffreId?: string;
    periodeId?: string;
    familleId?: string;
  }) {
    const { appelOffre: currentAppelOffre } = props;

    const appelOffreId = args.appelOffreId || currentAppelOffre?.id;
    const periodeId = args.periodeId || currentAppelOffre?.periode.id;
    const familleId =
      args.familleId || currentAppelOffre?.periode.familles.find((f) => f.id === familleId);

    if (!appelOffreId || !periodeId) return;

    const newAppelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId });
    if (!newAppelOffre) {
      props.hasError = true;
    } else {
      props.appelOffre = newAppelOffre;
    }
  }

  function _updateClasse(classe: string) {
    props.isClasse = classe === 'Classé';
  }

  function _allEventsHaveSameAggregateId() {
    return history
      ? history.every((event) => event.aggregateId?.includes(projectId.toString()))
      : true;
  }

  function _removePendingEventsOfType(type: DomainEvent['type']) {
    remove(pendingEvents, (event) => event.type === type);
  }

  function _updateDCRDate(appelOffre: ProjectAppelOffre) {
    if (props.isClasse) {
      _removePendingEventsOfType(ProjectDCRDueDateSet.type);
      const notifiedOnDate = new Date(props.notifiedOn);
      const delaiDcr = appelOffre.periode.delaiDcrEnMois.valeur;

      _publishEvent(
        new ProjectDCRDueDateSet({
          payload: {
            projectId: props.projectId.toString(),
            dcrDueOn: notifiedOnDate.setMonth(notifiedOnDate.getMonth() + delaiDcr),
          },
        }),
      );
    }
  }

  function _cancelDCRDate() {
    _publishEvent(
      new ProjectDCRDueDateCancelled({
        payload: {
          projectId: props.projectId.toString(),
        },
      }),
    );
  }

  function _updateCompletionDate(
    appelOffre: ProjectAppelOffre,
    forceValue?: { setBy?: string; completionDueOn: number },
  ) {
    if (!props.isClasse) return;

    if (props.hasCompletionDueDateMoved && !forceValue) return;

    if (!props.notifiedOn) return;

    const { setBy, completionDueOn } = forceValue || {};

    const moisAAjouter = getDelaiDeRealisation(appelOffre, props.data?.technologie ?? 'N/A') || 0;
    const nouvelleDateCompletionDueOn =
      completionDueOn ||
      sub(
        add(new Date(props.notifiedOn), {
          months: moisAAjouter,
        }),
        {
          days: 1,
        },
      ).getTime();

    _removePendingEventsOfType(ProjectCompletionDueDateSet.type);
    _publishEvent(
      new ProjectCompletionDueDateSet({
        payload: {
          projectId: props.projectId.toString(),
          completionDueOn: nouvelleDateCompletionDueOn,
          setBy: setBy || '',
        },
      }),
    );
  }

  function _cancelCompletionDate() {
    _publishEvent(
      new ProjectCompletionDueDateCancelled({
        payload: {
          projectId: props.projectId.toString(),
        },
      }),
    );
  }

  function _computeDelta(data) {
    const mainChanges = !!data && shallowDelta(props.data || {}, { ...data, details: undefined });

    const changes = { ...mainChanges } as Partial<ProjectDataProps>;

    const detailsChanges = !!data?.details && shallowDelta(props.data?.details || {}, data.details);

    if (detailsChanges) {
      changes.details = detailsChanges;
    }

    for (const key of Object.keys(changes)) {
      if (typeof changes[key] === 'undefined') {
        delete changes[key];
      }
    }

    return changes;
  }

  function _publishNewNotificationDate(payload: ProjectNotificationDateSet['payload']) {
    _publishEvent(
      new ProjectNotificationDateSet({
        payload,
      }),
    );
  }
};
