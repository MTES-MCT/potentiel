import { CahierDesChargesRéférence, DonnéesCourriersRéponse } from '@potentiel/domain-views';
import { ProjectAppelOffre } from './appelOffre';
import { parseCahierDesChargesRéférence } from './cahierDesCharges';

export type GetDonnéesCourriersRéponse = (
  cahierDesChargesActuel: CahierDesChargesRéférence,
  projectAppelOffre: ProjectAppelOffre,
) => DonnéesCourriersRéponse;

const donnéesCourriersRéponseParDéfaut: DonnéesCourriersRéponse = {
  texteChangementDActionnariat: {
    référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
    dispositions: '!!!CONTENU NON DISPONIBLE!!!',
  },
  texteChangementDeProducteur: {
    référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
    dispositions: '!!!CONTENU NON DISPONIBLE!!!',
  },
  texteChangementDePuissance: {
    référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
    dispositions: '!!!CONTENU NON DISPONIBLE!!!',
  },
  texteDélaisDAchèvement: {
    référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
    dispositions: '!!!CONTENU NON DISPONIBLE!!!',
  },
  texteEngagementRéalisationEtModalitésAbandon: {
    référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
    dispositions: '!!!CONTENU NON DISPONIBLE!!!',
  },
  texteIdentitéDuProducteur: {
    référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
    dispositions: '!!!CONTENU NON DISPONIBLE!!!',
  },
};

export const getDonnéesCourriersRéponse: GetDonnéesCourriersRéponse = (
  cahierDesChargesActuel,
  { donnéesCourriersRéponse, periode, cahiersDesChargesModifiésDisponibles },
) => {
  const cdc = parseCahierDesChargesRéférence(cahierDesChargesActuel);
  const cahierDesChargesModifié = periode.cahiersDesChargesModifiésDisponibles
    ? periode.cahiersDesChargesModifiésDisponibles.find(
        (c) => cdc.type === 'modifié' && c.paruLe === cdc.paruLe && c.alternatif === cdc.alternatif,
      )
    : cahiersDesChargesModifiésDisponibles.find(
        (c) => cdc.type === 'modifié' && c.paruLe === cdc.paruLe && c.alternatif === cdc.alternatif,
      );

  return {
    ...donnéesCourriersRéponseParDéfaut,
    ...donnéesCourriersRéponse,
    ...periode.donnéesCourriersRéponse,
    ...(cahierDesChargesModifié && cahierDesChargesModifié.donnéesCourriersRéponse),
  };
};
