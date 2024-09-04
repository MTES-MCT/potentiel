import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Candidature } from '@potentiel-domain/candidature';
import { publishToEventBus } from '../config/eventBus.config';
import { DésignationCatégorie, ProjectRawDataImported } from '../modules/project';
import { v4 } from 'uuid';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';
import getDepartementRegionFromCodePostal, {
  DepartementRegion,
} from '../helpers/getDepartementRegionFromCodePostal';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { ConsulterDocumentProjetQuery, DocumentProjet } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

export type SubscriptionEvent = (
  | Candidature.CandidatureImportéeEvent
  | Candidature.CandidatureCorrigéeEvent
) &
  Event;

export type Execute = Message<'System.Saga.Candidature', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { payload, type } = event;
    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: {
        identifiantAppelOffre: payload.appelOffre,
      },
    });
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);
    const date = DateTime.convertirEnValueType(
      type === 'CandidatureCorrigée-V1' ? payload.corrigéLe : payload.importéLe,
    );
    const details = await fetchDétails(identifiantProjet, date);
    switch (event.type) {
      case 'CandidatureImportée-V1':
      case 'CandidatureCorrigée-V1':
        await publishToEventBus(
          new ProjectRawDataImported({
            payload: {
              importId: v4(),
              data: { ...mapToLegacyEventPayload(payload, appelOffre), details },
            },
          }),
        );
        return;
    }
  };

  mediator.register('System.Saga.Candidature', handler);
};

const mapToLegacyEventPayload = (
  payload: SubscriptionEvent['payload'],
  appelOffre: Option.Type<AppelOffre.AppelOffreReadModel>,
) => {
  if (Option.isNone(appelOffre)) {
    throw new Error(`Appel offre ${payload.appelOffre} non trouvée`);
  }
  const période = appelOffre.periodes.find((x) => x.id === payload.période);
  if (!période) {
    throw new Error(`Période ${payload.période} non trouvée pour l'AO ${payload.appelOffre}`);
  }

  return {
    appelOffreId: payload.appelOffre,
    periodeId: payload.période,
    familleId: payload.famille,
    numeroCRE: payload.numéroCRE,
    classe: payload.statut === 'classé' ? 'Classé' : 'Eliminé',
    nomProjet: payload.nomProjet,
    nomCandidat: payload.nomCandidat,
    nomRepresentantLegal: payload.nomReprésentantLégal,
    email: payload.emailContact,
    motifsElimination: payload.motifÉlimination ?? '',
    garantiesFinancièresDateEchéance: payload.dateÉchéanceGf,
    technologie: payload.technologie,
    historiqueAbandon: payload.historiqueAbandon,
    puissance: payload.puissanceProductionAnnuelle,
    garantiesFinancièresType: getTypeGarantiesFinancieresLabel(payload.typeGarantiesFinancières),
    engagementFournitureDePuissanceAlaPointe: payload.puissanceALaPointe,
    actionnaire: payload.sociétéMère,
    prixReference: payload.prixReference,
    note: payload.noteTotale,
    evaluationCarbone: payload.evaluationCarboneSimplifiée,
    désignationCatégorie: getDésignationCatégorie({
      puissance: payload.puissanceProductionAnnuelle,
      note: payload.noteTotale,
      periodeDetails: période,
    }),

    // la saga ne supporte pas un import CRE4, donc on peut mettre à false les champs financement/investissement
    actionnariat: payload.actionnariat,
    isFinancementParticipatif: false,
    isInvestissementParticipatif: false,

    notifiedOn: 0,
    territoireProjet: payload.territoireProjet,
    ...getLocalitéInfo(payload.localité),
  };
};

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
  typeGf?: GarantiesFinancières.TypeGarantiesFinancières.RawType,
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
  const { content } = await mediator.send<ConsulterDocumentProjetQuery>({
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

  const result = await convertReadableStreamToString(content);
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
