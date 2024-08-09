import { AppelOffre } from '@potentiel-domain/appel-offre';
import { ProjectAppelOffre } from './appelOffre';
import { parseCahierDesChargesRéférence } from './cahierDesCharges';

export type GetDonnéesCourriersRéponse = (
  cahierDesChargesActuel: AppelOffre.CahierDesChargesRéférence,
  projectAppelOffre: ProjectAppelOffre,
) => AppelOffre.DonnéesCourriersRéponse;

const donnéesCourriersRéponseParDéfaut: AppelOffre.DonnéesCourriersRéponse = {
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
  { donnéesCourriersRéponse, periode },
) => {
  const cdc = parseCahierDesChargesRéférence(cahierDesChargesActuel);
  const cahierDesChargesModifié = periode.cahiersDesChargesModifiésDisponibles.find(
    (c) => cdc.type === 'modifié' && c.paruLe === cdc.paruLe && c.alternatif === cdc.alternatif,
  );

  return {
    ...donnéesCourriersRéponseParDéfaut,
    ...donnéesCourriersRéponse,
    ...periode.donnéesCourriersRéponse,
    ...(cahierDesChargesModifié && cahierDesChargesModifié.donnéesCourriersRéponse),
  };
};
