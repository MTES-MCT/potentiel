import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Candidature } from '@potentiel-domain/candidature';
import { publishToEventBus } from '../config/eventBus.config';
import { DésignationCatégorie, ProjectRawDataImported } from '../modules/project';
import { logger } from '../core/utils';
import { v4 } from 'uuid';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';
import { CandidatureImportéeEvent } from '@potentiel-domain/candidature/dist/candidature';
import getDepartementRegionFromCodePostal, {
  DepartementRegion,
} from '../helpers/getDepartementRegionFromCodePostal';

export type SubscriptionEvent = Candidature.CandidatureImportéeEvent & Event;

export type Execute = Message<'System.Saga.Candidature', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    switch (event.type) {
      case 'CandidatureImportée-V1':
        const { payload } = event;

        const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
          type: 'AppelOffre.Query.ConsulterAppelOffre',
          data: {
            identifiantAppelOffre: payload.appelOffre,
          },
        });

        if (Option.isNone(appelOffre)) {
          throw new Error(`Appel offre ${payload.appelOffre} non trouvée`);
        }
        const période = appelOffre.periodes.find((x) => x.id === payload.période);
        if (!période) {
          throw new Error(`Période ${payload.période} non trouvée pour l'AO ${payload.appelOffre}`);
        }

        await publishToEventBus(
          new ProjectRawDataImported({
            payload: {
              importId: v4(),
              data: {
                appelOffreId: payload.appelOffre,
                periodeId: payload.période,
                familleId: payload.famille,
                numeroCRE: payload.numéroCRE,
                classe: payload.statut === 'classé' ? 'Classé' : 'Eliminé', // TODO check
                nomProjet: payload.nomProjet,
                nomCandidat: payload.nomCandidat,
                nomRepresentantLegal: payload.nomReprésentantLégal,
                email: payload.emailContact,
                motifsElimination: payload.motifÉlimination,
                garantiesFinancièresDateEchéance: payload.dateÉchéanceGf,
                technologie: payload.technologie,
                historiqueAbandon: payload.historiqueAbandon,
                puissance: payload.puissanceProductionAnnuelle,
                garantiesFinancièresType: payload.typeGarantiesFinancières,
                details: payload.détails,
                engagementFournitureDePuissanceAlaPointe: payload.puissanceALaPointe,
                actionnaire: payload.sociétéMère,
                prixReference: payload.prixReference,
                note: payload.noteTotale,
                isFinancementParticipatif: payload.financementCollectif,
                evaluationCarbone: payload.evaluationCarboneSimplifiée,
                actionnariat: payload.financementCollectif
                  ? 'financement-collectif'
                  : payload.gouvernancePartagée
                    ? 'gouvernance-partagee'
                    : undefined,
                désignationCatégorie: getDésignationCatégorie({
                  puissance: payload.puissanceProductionAnnuelle,
                  note: payload.noteTotale,
                  periodeDetails: période,
                }),
                isInvestissementParticipatif: payload.financementParticipatif,
                notifiedOn: 0,
                territoireProjet: payload.teritoireProjet,
                ...getLocalilitéInfo(payload),
              },
            },
          }),
        );
        logger.warning('Identifiant projet inconnu', {
          saga: 'System.Saga.Candidature',
          event,
        });
        return;
    }
  };

  mediator.register('System.Saga.Candidature', handler);
};

const getLocalilitéInfo = ({
  codePostal,
  adresse1,
  adresse2,
  commune,
}: CandidatureImportéeEvent['payload']) => {
  const departementsRegions = codePostal
    .split('/')
    .map((str) => str.trim())
    .map(getDepartementRegionFromCodePostal)
    .filter((dptRegion): dptRegion is DepartementRegion => !!dptRegion);
  const departements = departementsRegions.map((x) => x.departement);
  const régions = departementsRegions.map((x) => x.region);
  const codePostaux = departementsRegions.map((x) => x.codePostal);
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
