import { DonnéesCourriersRéponse } from '@entities'
import { parseCahierDesChargesActuel } from '@entities/cahierDesCharges'
import { GetDonnéesCourriersRéponse } from '@modules/modificationRequest'

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
  const cdc = parseCahierDesChargesActuel(cahierDesChargesActuel)
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
