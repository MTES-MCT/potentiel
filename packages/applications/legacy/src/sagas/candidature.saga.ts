import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Candidature, DocumentProjet, Document, IdentifiantProjet } from '@potentiel-domain/projet';
import { eventStore } from '../config/eventStore.config';
import {
  DésignationCatégorie,
  ProjectClasseGranted,
  ProjectCompletionDueDateSet,
  ProjectRawDataCorrected,
  ProjectRawDataImported,
} from '../modules/project';
import { v4 } from 'uuid';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';
import getDepartementRegionFromCodePostal, {
  DepartementRegion,
} from '../helpers/getDepartementRegionFromCodePostal';
import { DateTime } from '@potentiel-domain/common';
import { getLegacyProjetByIdentifiantProjet } from '../infra/sequelize/queries/project';
import { getUserByEmail } from '../infra/sequelize/queries/users/getUserByEmail';
import { ok } from 'neverthrow';
import { getCompletionDate } from './_helpers/getCompletionDate';
import { getLogger } from '@potentiel-libraries/monitoring';

export type SubscriptionEvent = (
  | Candidature.CandidatureImportéeEvent
  | Candidature.CandidatureCorrigéeEvent
) &
  Event;

export type Execute = Message<'System.Saga.Candidature', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { payload, type } = event;
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: {
        identifiantAppelOffre: identifiantProjet.appelOffre,
      },
    });
    if (Option.isNone(appelOffre)) {
      throw new Error(`Appel offre ${identifiantProjet.appelOffre} non trouvé`);
    }

    switch (type) {
      case 'CandidatureImportée-V2':
        const details = await fetchDétails(
          identifiantProjet,
          DateTime.convertirEnValueType(payload.importéLe),
        );
        await eventStore.publish(
          new ProjectRawDataImported({
            payload: {
              importId: v4(),
              data: {
                ...mapToLegacyEventPayload(identifiantProjet, payload, appelOffre),
                details,
              },
            },
          }),
        );
        break;

      case 'CandidatureCorrigée-V2':
        const projet = await getLegacyProjetByIdentifiantProjet(identifiantProjet);
        // Si le projet n'est pas notifié, on le réimporte
        if (!projet?.notifiedOn) {
          const details =
            payload.détailsMisÀJour &&
            (await fetchDétails(
              identifiantProjet,
              DateTime.convertirEnValueType(payload.corrigéLe),
            ));
          await eventStore.publish(
            new ProjectRawDataImported({
              payload: {
                importId: v4(),
                data: {
                  ...mapToLegacyEventPayload(identifiantProjet, payload, appelOffre),
                  details,
                },
              },
            }),
          );
          return;
        }

        const userId = await new Promise<string>((r) =>
          getUserByEmail(event.payload.corrigéPar).map((user) => {
            r(user?.id ?? '');
            return ok(user);
          }),
        );

        // si le projet a changé de statut, on notifie son nouveau statut
        if (projet.classe === 'Eliminé' && event.payload.statut === 'classé') {
          await eventStore.publish(
            new ProjectClasseGranted({
              payload: {
                projectId: projet.id,
                grantedBy: userId,
              },
            }),
          );
        }

        // si le projet est notifié, on corrige les données
        // sauf celles qui ont un cycle de vie après la candidature
        await eventStore.publish(
          new ProjectRawDataCorrected({
            payload: {
              correctedBy: userId,
              projectId: projet.id,
              correctedData: mapToNotifiedCorrectedData(event.payload),
            },
          }),
        );

        const completionDueOn = getCompletionDate(
          DateTime.convertirEnValueType(new Date(projet.notifiedOn)),
          appelOffre,
          event.payload.technologie,
        );
        if (
          !completionDueOn.estÉgaleÀ(
            DateTime.convertirEnValueType(new Date(projet.completionDueOn)),
          )
        ) {
          getLogger().info('Due date mise à jour', {
            identifiantProjet: identifiantProjet.formatter(),
          });
          await eventStore.publish(
            new ProjectCompletionDueDateSet({
              payload: {
                projectId: projet.id,
                completionDueOn: completionDueOn.date.getTime(),
                setBy: payload.corrigéPar,
              },
            }),
          );
        }

        return;
    }
  };

  mediator.register('System.Saga.Candidature', handler);
};

const mapToLegacyEventPayload = (
  identifiantProjet: IdentifiantProjet.ValueType,
  payload: SubscriptionEvent['payload'],
  appelOffre: AppelOffre.AppelOffreReadModel,
): Omit<ProjectRawDataImported['payload']['data'], 'details'> => {
  const période = appelOffre.periodes.find((x) => x.id === identifiantProjet.période);
  if (!période) {
    throw new Error(
      `Période ${identifiantProjet.période} non trouvée pour l'AO ${identifiantProjet.appelOffre}`,
    );
  }

  return {
    appelOffreId: identifiantProjet.appelOffre,
    periodeId: identifiantProjet.période,
    familleId: identifiantProjet.famille,
    numeroCRE: identifiantProjet.numéroCRE,
    classe: payload.statut === 'classé' ? 'Classé' : 'Eliminé',
    garantiesFinancièresDateEchéance: payload.dateÉchéanceGf,
    garantiesFinancièresType: getTypeGarantiesFinancieresLabel(payload.typeGarantiesFinancières),
    technologie: payload.technologie,
    historiqueAbandon: payload.historiqueAbandon,
    désignationCatégorie: getDésignationCatégorie({
      puissance: payload.puissanceProductionAnnuelle,
      note: payload.noteTotale,
      periodeDetails: période,
    }),
    notifiedOn: 0,
    ...mapToCorrectedData(payload),
    ...getLocalitéInfo(payload.localité),
  };
};

const mapToNotifiedCorrectedData = (
  payload: SubscriptionEvent['payload'],
): ProjectRawDataCorrected['payload']['correctedData'] => ({
  email: payload.emailContact,
  motifsElimination: payload.motifÉlimination ?? '',
  puissanceInitiale: payload.puissanceProductionAnnuelle,
  engagementFournitureDePuissanceAlaPointe: payload.puissanceALaPointe,
  prixReference: payload.prixReference,
  note: payload.noteTotale,
  actionnariat:
    payload.actionnariat === 'financement-collectif'
      ? 'financement-collectif'
      : payload.actionnariat === 'gouvernance-partagée'
        ? 'gouvernance-partagee'
        : undefined,
  isFinancementParticipatif: payload.actionnariat === 'financement-participatif',
  isInvestissementParticipatif: payload.actionnariat === 'investissement-participatif',
  territoireProjet: payload.territoireProjet,
});

const mapToCorrectedData = (payload: SubscriptionEvent['payload']) => ({
  nomProjet: payload.nomProjet,
  nomCandidat: payload.nomCandidat,
  nomRepresentantLegal: payload.nomReprésentantLégal,
  email: payload.emailContact,
  motifsElimination: payload.motifÉlimination ?? '',
  actionnaire: payload.sociétéMère,
  puissance: payload.puissanceProductionAnnuelle,
  puissanceInitiale: payload.puissanceProductionAnnuelle,
  engagementFournitureDePuissanceAlaPointe: payload.puissanceALaPointe,
  prixReference: payload.prixReference,
  note: payload.noteTotale,
  evaluationCarbone: payload.evaluationCarboneSimplifiée,
  actionnariat:
    payload.actionnariat === 'financement-collectif'
      ? 'financement-collectif'
      : payload.actionnariat === 'gouvernance-partagée'
        ? 'gouvernance-partagee'
        : undefined,
  isFinancementParticipatif: payload.actionnariat === 'financement-participatif',
  isInvestissementParticipatif: payload.actionnariat === 'investissement-participatif',

  territoireProjet: payload.territoireProjet,
  ...getLocalitéInfo(payload.localité),
});

const getLocalitéInfo = ({
  codePostal,
  adresse1,
  adresse2,
  commune,
}: Candidature.CandidatureImportéeEvent['payload']['localité']) => {
  const départementsRégions = codePostal
    .split('/')
    .map((str) => str.trim())
    .map(getDepartementRegionFromCodePostal)
    .filter((dptRegion): dptRegion is DepartementRegion => !!dptRegion);

  const departements = Array.from(new Set(départementsRégions.map((x) => x.departement)));
  const régions = Array.from(new Set(départementsRégions.map((x) => x.region)));
  const codePostaux = départementsRégions.map((x) => x.codePostal);

  return {
    departementProjet: departements.join(' / '),
    regionProjet: régions.join(' / '),
    codePostalProjet: codePostaux.join(' / '),
    communeProjet: commune,
    adresseProjet: [adresse1, adresse2].filter(Boolean).join('\n'),
  };
};

const getDésignationCatégorie = ({
  puissance,
  note,
  periodeDetails,
}: {
  puissance: number;
  note: number;
  periodeDetails: AppelOffre.Periode;
}): DésignationCatégorie | undefined => {
  if (periodeDetails.noteThresholdBy !== 'category') {
    return;
  }

  return puissance <= periodeDetails.noteThreshold.volumeReserve.puissanceMax &&
    note >= periodeDetails.noteThreshold.volumeReserve.noteThreshold
    ? 'volume-réservé'
    : 'hors-volume-réservé';
};

const getTypeGarantiesFinancieresLabel = (
  typeGf?: Candidature.TypeGarantiesFinancières.RawType,
) => {
  if (!typeGf) {
    return undefined;
  }

  switch (typeGf) {
    case 'six-mois-après-achèvement':
      return "Garantie financière jusqu'à 6 mois après la date d'achèvement";
    case 'avec-date-échéance':
      return 'Garantie financière avec date d’échéance et à renouveler';
    case 'consignation':
      return 'Consignation';
    case 'type-inconnu':
      return undefined;
  }
};

const fetchDétails = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  date: DateTime.ValueType,
) => {
  const détailsImport = await mediator.send<Document.ConsulterDocumentProjetQuery>({
    type: 'Document.Query.ConsulterDocumentProjet',
    data: {
      documentKey: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        'candidature/import',
        date.formatter(),
        'application/json',
      ).formatter(),
    },
  });

  const result = await Option.match(détailsImport)
    .some(async ({ content }) => await convertReadableStreamToString(content))
    .none(() => Promise.resolve('{}'));

  return JSON.parse(result) as Record<string, string>;
};

const convertReadableStreamToString = async (readable: ReadableStream) => {
  const reader = readable.getReader();

  const chunks: Buffer[] = [];

  const readFile = async (): Promise<void> => {
    const result = await reader.read();
    if (result.done) {
      reader.releaseLock();
    } else {
      chunks.push(Buffer.from(result.value));
      return await readFile();
    }
  };
  await readFile();

  return Buffer.concat(chunks).toString('utf-8');
};
