import { Text } from '@react-pdf/renderer'
import React from 'react'
import { ProjectDataForCertificate } from '@modules/project/dtos'

type ObjetProps = {
  project: ProjectDataForCertificate
}

export const Objet = ({ project }: ObjetProps) => {
  const { appelOffre, isClasse } = project
  const { periode } = appelOffre || {}

  return (
    <Text style={{ fontWeight: 'bold', marginTop: 30 }}>
      Objet :{' '}
      {isClasse
        ? `Désignation des lauréats de la ${periode.title} période de l'appel d'offres ${appelOffre.title}`
        : `Avis de rejet à l’issue de la ${periode.title} période de l'appel offres ${appelOffre.title}`}
    </Text>
  )
}
