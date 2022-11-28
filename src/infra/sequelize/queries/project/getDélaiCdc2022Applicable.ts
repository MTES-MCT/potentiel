import { getProjectAppelOffre } from '@config/queryProjectAO.config'
import { GetDélaiCDC2022Applicable } from '@modules/project'

export const getDélaiCDC2022Applicable: GetDélaiCDC2022Applicable = ({
  appelOffreId,
  periodeId,
  familleId,
  cahierDesChargesParsed,
}) => {
  const projectAppelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })
  if (!projectAppelOffre) return undefined

  const détailsCDC =
    projectAppelOffre!.cahiersDesChargesModifiésDisponibles &&
    projectAppelOffre!.cahiersDesChargesModifiésDisponibles.find(
      (CDC) =>
        CDC.type === cahierDesChargesParsed.type &&
        CDC.paruLe === cahierDesChargesParsed.paruLe &&
        CDC.alternatif === cahierDesChargesParsed.alternatif
    )

  return détailsCDC && détailsCDC.délaiApplicable?.délaiEnMois
}
