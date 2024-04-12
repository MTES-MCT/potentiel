import { Text } from '@react-pdf/renderer';
import React from 'react';
import { ProjectDataForCertificate } from '../../../../modules/project/dtos';
import { formatNumber } from '../../helpers/formatNumber';

type IntroductionProps = {
  project: ProjectDataForCertificate;
};

export const Introduction = ({ project }: IntroductionProps) => {
  const { appelOffre } = project;
  const { periode } = appelOffre || {};

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
        En application des dispositions de l’article L.{' '}
        {appelOffre.typeAppelOffre === 'biométhane' ? '446-5' : '311-10'} du code de l’énergie
        relatif à la procédure de mise en concurrence pour les installations de production{' '}
        {appelOffre.typeAppelOffre === 'biométhane'
          ? 'de biométhane destiné à être injecté dans le réseau de gaz'
          : `d’électricité`}
        , le ministre chargé de l’énergie a lancé en {appelOffre.launchDate} l’appel d’offres cité
        en objet.
      </Text>

      <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10 }}>
        En réponse à la {periode.title} période de cet appel d’offres, vous avez déposé{' '}
        {appelOffre.familles.length > 0 && project.familleId
          ? `dans la famille ${project.familleId} `
          : ''}{' '}
        le projet « {project.nomProjet} », situé {project.adresseProjet} {project.codePostalProjet}{' '}
        {project.communeProjet} d’une{' '}
        {appelOffre.typeAppelOffre === 'biométhane'
          ? 'production annuelle prévisionnelle'
          : 'puissance'}{' '}
        de {formatNumber(project.puissance, 1e6)} {appelOffre.unitePuissance}.
      </Text>
    </>
  );
};
