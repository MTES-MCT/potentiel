import { ProjectAppelOffre } from './appelOffre'
import { CahierDesChargesRéférence, parseCahierDesChargesRéférence } from './cahierDesCharges'

export type DonnéesCourriersRéponse = Record<
  | 'texteEngagementRéalisationEtModalitésAbandon'
  | 'texteChangementDActionnariat'
  | 'texteChangementDePuissance'
  | 'texteIdentitéDuProducteur'
  | 'texteChangementDeProducteur'
  | 'texteDélaisDAchèvement',
  {
    référenceParagraphe: string
    dispositions: string
  }
>

export type GetDonnéesCourriersRéponse = (
  cahierDesChargesActuel: CahierDesChargesRéférence,
  projectAppelOffre: ProjectAppelOffre
) => DonnéesCourriersRéponse

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
}

export const getDonnéesCourriersRéponse: GetDonnéesCourriersRéponse = (
  cahierDesChargesActuel,
  { donnéesCourriersRéponse, periode, cahiersDesChargesModifiésDisponibles }
) => {
  const cdc = parseCahierDesChargesRéférence(cahierDesChargesActuel)
  const cahierDesChargesModifié = cahiersDesChargesModifiésDisponibles.find(
    (c) => c.paruLe === cdc.paruLe && c.alternatif === cdc.alternatif
  )

  return {
    ...donnéesCourriersRéponseParDéfaut,
    ...donnéesCourriersRéponse,
    ...periode.donnéesCourriersRéponse,
    ...(cahierDesChargesModifié && cahierDesChargesModifié.donnéesCourriersRéponse),
  }
}
