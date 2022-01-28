import { Text } from '@react-pdf/renderer'
import React from 'react'
import { ProjectDataForCertificate } from '@modules/project/dtos'
import { formatNumber } from '../helpers/formatNumber'

type IntroductionProps = {
  project: ProjectDataForCertificate
}

export const Introduction = ({ project }: IntroductionProps) => {
  const { appelOffre } = project
  const { periode } = appelOffre || {}

  return (
    <>
      <Text
        style={{
          marginTop: 30,
          marginBottom: 20,
          marginLeft: 20,
        }}
      >
        Madame, Monsieur,
      </Text>

      <Text style={{ fontSize: 10 }}>
        En application des dispositions de l’article L. 311-10 du code de l’énergie relatif à la
        procédure de mise en concurrence pour les installations de production d’électricité, le
        ministre chargé de l’énergie a lancé en ${appelOffre.launchDate} l’appel d’offres cité en
        objet.
      </Text>

      <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10 }}>
        En réponse à la {periode.title} tranche de cet appel d’offres, vous avez déposé{' '}
        {appelOffre.familles.length && project.familleId
          ? `dans la famille ${project.familleId} `
          : ''}{' '}
        le projet « {project.nomProjet} », situé {project.adresseProjet} {project.codePostalProjet}{' '}
        {project.communeProjet} d’une puissance de {formatNumber(project.puissance, 1e6)}{' '}
        {appelOffre.unitePuissance}.
      </Text>
    </>
  )
}
