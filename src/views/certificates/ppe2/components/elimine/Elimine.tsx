import { Text } from '@react-pdf/renderer'
import React from 'react'
import { ProjectDataForCertificate } from '@modules/project/dtos'
import { MotifElimination } from './motifElimination'
import { isSoumisAuxGFs } from '@modules/projectAppelOffre'

type ElimineProps = {
  project: ProjectDataForCertificate
}

export const Elimine = ({ project }: ElimineProps) => {
  const { appelOffre } = project
  const { renvoiRetraitDesignationGarantieFinancieres } = appelOffre

  const soumisAuxGarantiesFinancieres = isSoumisAuxGFs(appelOffre)

  return (
    <>
      <Text style={{ marginTop: 10 }}>
        <MotifElimination {...{ project }} />
      </Text>

      {soumisAuxGarantiesFinancieres && (
        <Text style={{ marginTop: 10 }}>
          Conformément au paragraphe {renvoiRetraitDesignationGarantieFinancieres} la garantie
          financière est annulée automatiquement.
        </Text>
      )}

      <Text style={{ marginTop: 10 }}>
        Vous avez la possibilité de contester la présente décision auprès du tribunal administratif
        territorialement compétent dans un délai de deux mois à compter de sa date de notification.
      </Text>
    </>
  )
}
