import { parseCahierDesChargesActuel } from '@entities/cahierDesCharges'
import { GetDonnéesCourriersRéponse } from '@modules/modificationRequest'

export const getDonnéesCourriersRéponse: GetDonnéesCourriersRéponse = (
  cahierDesChargesActuel,
  { donnéesCourriersRéponse, periode, cahiersDesChargesModifiésDisponibles }
) => {
  const cdc = parseCahierDesChargesActuel(cahierDesChargesActuel)
  const cahierDesChargesModifié = cahiersDesChargesModifiésDisponibles.find(
    (c) => c.paruLe === cdc.paruLe && c.alternatif === cdc.alternatif
  )

  return {
    ...donnéesCourriersRéponse,
    ...(periode.donnéesCourriersRéponse && periode.donnéesCourriersRéponse),
    ...(cahierDesChargesModifié && cahierDesChargesModifié.donnéesCourriersRéponse),
  }
}
