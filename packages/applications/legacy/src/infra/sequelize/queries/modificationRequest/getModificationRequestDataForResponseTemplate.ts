import { getDonnéesCourriersRéponse } from '../../../../entities/donnéesCourriersRéponse';
import { getProjectAppelOffre } from '../../../../config/queryProjectAO.config';
import { oldUserRepo } from '../../../../config/repos.config';
import { errAsync, logger, ok, okAsync, ResultAsync, wrapInfra } from '../../../../core/utils';
import {
  GetModificationRequestDateForResponseTemplate,
  ModificationRequestDataForResponseTemplateDTO,
} from '../../../../modules/modificationRequest';
import { getDelaiDeRealisation } from '../../../../modules/projectAppelOffre';
import { EntityNotFoundError, InfraNotAvailableError } from '../../../../modules/shared';
import moment from 'moment';
import { formatDate } from '../../../../helpers/formatDate';
import { REGIONS, Région } from '../../../../modules/dreal/région';
import { Project, User, ModificationRequest, File } from '../../projectionsNext';

const getEdfType = (region: Région) => {
  if (!region) {
    return {
      isEDFOA: '',
      isEDFSEI: '',
      isEDM: '',
    };
  }

  const regionOutreMer: Région[] = ['Guadeloupe', 'Guyane', 'Martinique', 'Corse', 'La Réunion'];
  return {
    isEDFOA: `${region !== 'Mayotte' && !regionOutreMer.includes(region) ? 'true' : ''}`,
    isEDFSEI: `${regionOutreMer.includes(region) ? 'true' : ''}`,
    isEDM: `${region === 'Mayotte' ? 'true' : ''}`,
  };
};

const getAuthority = (authority: 'dreal' | 'dgec') => {
  switch (authority) {
    case 'dgec':
      return {
        isDrealAuthority: '',
        isDgecAuthority: 'true',
      };
    case 'dreal':
      return {
        isDrealAuthority: 'true',
        isDgecAuthority: '',
      };

    default:
      return {
        isDrealAuthority: '',
        isDgecAuthority: '',
      };
  }
};

export const getModificationRequestDataForResponseTemplate: GetModificationRequestDateForResponseTemplate =
  (modificationRequestId, user, dgecEmail) => {
    if (!ModificationRequest || !Project || !File || !User) {
      // TODO: check inutile après la migration projection next
      return errAsync(new InfraNotAvailableError());
    }
    return _getModificationRequestById(modificationRequestId)
      .andThen(
        (
          modificationRequest: any,
        ): ResultAsync<
          { modificationRequest: any; previousRequest: any },
          EntityNotFoundError | InfraNotAvailableError
        > => {
          if (!modificationRequest) return errAsync(new EntityNotFoundError());
          const { type, projectId } = modificationRequest;
          if (type === 'delai') {
            return _getPreviouslyAcceptedDelaiRequest(projectId).map((previousRequest) => ({
              modificationRequest,
              previousRequest,
            }));
          }

          return okAsync({ modificationRequest, previousRequest: null });
        },
      )
      .andThen(
        ({
          modificationRequest,
          previousRequest,
        }): ResultAsync<
          {
            dreal: Région | '';
            modificationRequest;
            previousRequest;
            isEDFOA: string;
            isEDFSEI: string;
            isEDM: string;
            isDgecAuthority: string;
            isDrealAuthority: string;
          },
          InfraNotAvailableError
        > => {
          const {
            project: { regionProjet },
          } = modificationRequest;

          if (user.role === 'dreal') {
            return wrapInfra(oldUserRepo.findDrealsForUser(user.id)).map((userDreals) => {
              // If there are multiple, use the first to coincide with the project
              const dreal = userDreals.find((dreal) => regionProjet.includes(dreal)) || '';

              return {
                dreal,
                modificationRequest,
                previousRequest,
                ...getEdfType(regionProjet),
                ...getAuthority(modificationRequest.authority),
              };
            });
          }

          const dreal = [...REGIONS].find(
            (region) => region.toLowerCase() === regionProjet.toLowerCase(),
          );

          return okAsync({
            dreal: dreal || '',
            modificationRequest,
            previousRequest,
            ...getEdfType(regionProjet),
            ...getAuthority(modificationRequest.authority),
          });
        },
      )
      .andThen(
        ({
          dreal,
          modificationRequest,
          previousRequest,
          isEDFOA,
          isEDFSEI,
          isEDM,
          isDgecAuthority,
          isDrealAuthority,
        }) => {
          const {
            type,
            project,
            requestedOn,
            delayInMonths = null,
            justification,
            status,
            producteur,
            dateAchèvementDemandée = null,
          } = modificationRequest;

          const { appelOffreId, periodeId, familleId, technologie } = project;
          const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId });

          if (!appelOffre || !appelOffre?.periode) {
            logger.error(
              new Error(
                `getModificationRequestDataForResponseTemplate failed to find the appelOffre for this id ${appelOffreId}`,
              ),
            );
            return errAsync(new InfraNotAvailableError());
          }

          const {
            nomRepresentantLegal,
            nomCandidat,
            details,
            email,
            nomProjet,
            puissance,
            codePostalProjet,
            communeProjet,
            completionDueOn,
            notifiedOn,
            potentielIdentifier,
            cahierDesChargesActuel,
          } = project;

          const { periode, unitePuissance } = appelOffre;

          const commonData = {
            type,
            suiviPar: user.fullName,
            suiviParEmail: user.role === 'dreal' ? user.email : dgecEmail,
            dreal,
            refPotentiel: potentielIdentifier,
            nomRepresentantLegal,
            nomCandidat,
            status,
            adresseCandidat: (details && details['Adresse postale du contact']) || '',
            email,
            titrePeriode: periode.title,
            periodeId: periode.id,
            appelOffreId: appelOffre.id,
            titreAppelOffre: `${periode.cahierDesCharges.référence} ${appelOffre.title}`,
            familles: periode.familles.length ? 'yes' : '',
            titreFamille: familleId,
            nomProjet,
            puissance: puissance.toString(),
            codePostalProjet,
            communeProjet,
            unitePuissance,
            dateDemande: formatDate(requestedOn),
            justificationDemande: justification,
            dateNotification: formatDate(notifiedOn),
            isEDFOA,
            isEDFSEI,
            isEDM,
            isDgecAuthority,
            isDrealAuthority,
          };

          const {
            texteChangementDeProducteur,
            texteChangementDePuissance,
            texteDélaisDAchèvement,
            texteIdentitéDuProducteur,
          } = getDonnéesCourriersRéponse(cahierDesChargesActuel, appelOffre);
          switch (type) {
            case 'delai':
              return ok({
                ...commonData,
                referenceParagrapheAchevement: texteDélaisDAchèvement.référenceParagraphe,
                contenuParagrapheAchevement: texteDélaisDAchèvement.dispositions,
                dateLimiteAchevementInitiale: formatDate(
                  Number(
                    moment(notifiedOn)
                      .add(getDelaiDeRealisation(appelOffre, technologie), 'months')
                      .subtract(1, 'day'),
                  ),
                  'DD/MM/YYYY',
                ),
                dateAchèvementDemandée: dateAchèvementDemandée
                  ? formatDate(dateAchèvementDemandée)
                  : formatDate(Number(moment(completionDueOn).add(delayInMonths, 'months'))),
                dateLimiteAchevementActuelle: formatDate(completionDueOn),
                ..._makePreviousDelaiFromPreviousRequest(previousRequest),
              } as ModificationRequestDataForResponseTemplateDTO);

            case 'puissance':
              const { puissance: puissanceActuelle } = modificationRequest.project;
              const {
                project: { puissanceInitiale },
                puissance: nouvellePuissance,
              } = modificationRequest;

              return ok({
                ...commonData,
                puissanceInitiale:
                  puissanceInitiale !== puissanceActuelle ? puissanceInitiale : undefined,
                nouvellePuissance,
                puissanceActuelle,
                referenceParagraphePuissance: texteChangementDePuissance.référenceParagraphe,
                contenuParagraphePuissance: texteChangementDePuissance.dispositions,
              } as ModificationRequestDataForResponseTemplateDTO);

            case 'producteur':
              return ok({
                ...commonData,
                nouveauProducteur: producteur,
                referenceParagrapheIdentiteProducteur:
                  texteIdentitéDuProducteur.référenceParagraphe,
                contenuParagrapheIdentiteProducteur: texteIdentitéDuProducteur.dispositions,
                referenceParagrapheChangementProducteur:
                  texteChangementDeProducteur.référenceParagraphe,
                contenuParagrapheChangementProducteur: texteChangementDeProducteur.dispositions,
              } as ModificationRequestDataForResponseTemplateDTO);
          }

          return errAsync(new EntityNotFoundError());
        },
      );
  };

function _getModificationRequestById(modificationRequestId) {
  return wrapInfra(
    ModificationRequest.findByPk(modificationRequestId, {
      include: [
        {
          model: Project,
          as: 'project',
        },
      ],
    }),
  ).map((rawData: any) => rawData?.get());
}

function _getPreviouslyAcceptedDelaiRequest(projectId) {
  return wrapInfra(
    ModificationRequest.findOne({
      where: {
        projectId,
        status: 'acceptée',
        type: 'delai',
      },
    }),
  ).map((rawData: any) => rawData?.get());
}

function _makePreviousDelaiFromPreviousRequest(previousRequest) {
  if (!previousRequest) return { demandePrecedente: '' };

  const {
    requestedOn,
    delayInMonths = null,
    acceptanceParams,
    respondedOn,
    isLegacy,
    dateAchèvementDemandée,
  } = previousRequest;

  if (isLegacy) {
    const legacyDelay = monthDiff(
      new Date(acceptanceParams.ancienneDateLimiteAchevement),
      new Date(acceptanceParams.nouvelleDateLimiteAchevement),
    );
    return {
      demandePrecedente: 'yes',
      dateDepotDemandePrecedente: formatDate(requestedOn),
      dureeDelaiDemandePrecedenteEnMois: legacyDelay.toString(),
      dateReponseDemandePrecedente: formatDate(respondedOn),
      autreDelaiDemandePrecedenteAccorde: '',
      delaiDemandePrecedenteAccordeEnMois: legacyDelay.toString(),
    };
  }
  const common = {
    demandePrecedente: 'yes',
    dateDepotDemandePrecedente: formatDate(requestedOn),
    dateReponseDemandePrecedente: formatDate(respondedOn),
  };

  if (dateAchèvementDemandée) {
    return {
      ...common,
      dateDemandePrecedenteDemandée: formatDate(dateAchèvementDemandée),
      dateDemandePrecedenteAccordée: formatDate(acceptanceParams.dateAchèvementAccordée),
      demandeEnDate: 'yes',
      autreDelaiDemandePrecedenteAccorde:
        dateAchèvementDemandée !== acceptanceParams.dateAchèvementAccordée ? 'yes' : '',
    };
  }

  if (delayInMonths) {
    return {
      ...common,
      demandeEnMois: 'yes',
      dureeDelaiDemandePrecedenteEnMois: delayInMonths.toString(),
      ...(acceptanceParams.delayInMonths && {
        delaiDemandePrecedenteAccordeEnMois: acceptanceParams.delayInMonths.toString(),
        autreDelaiDemandePrecedenteAccorde:
          delayInMonths !== acceptanceParams.delayInMonths ? 'yes' : '',
      }),
      ...(acceptanceParams.dateAchèvementAccordée && {
        demandeEnMoisAccordéeEnDate: 'yes',
        dateDemandePrecedenteAccordée: formatDate(acceptanceParams.dateAchèvementAccordée),
        autreDelaiDemandePrecedenteAccorde:
          dateAchèvementDemandée !== acceptanceParams.dateAchèvementAccordée ? 'yes' : '',
      }),
    };
  }

  return { demandePrecedente: '' };
}

function monthDiff(dateFrom, dateTo) {
  return (
    dateTo.getMonth() - dateFrom.getMonth() + 12 * (dateTo.getFullYear() - dateFrom.getFullYear())
  );
}
