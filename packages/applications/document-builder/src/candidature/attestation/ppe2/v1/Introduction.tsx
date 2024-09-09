import { Text } from '@react-pdf/renderer';
import React from 'react';

import { formatNumber } from '../../helpers/formatNumber';
import { AttestationPPE2Options } from '../../AttestationCandidatureOptions';

type IntroductionProps = {
  project: AttestationPPE2Options;
};

export const Introduction = ({ project }: IntroductionProps) => {
  const { appelOffre, période, famille } = project;

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
        ministre chargé de l’énergie a lancé en {appelOffre.launchDate} l’appel d’offres cité en
        objet.
      </Text>

      <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10 }}>
        En réponse à la {période.title} tranche de cet appel d’offres, vous avez déposé{' '}
        {période.familles.length > 0 && famille ? `dans la famille ${famille.id} ` : ''} le projet «{' '}
        {project.nomProjet} », situé {project.adresseProjet} {project.codePostalProjet}{' '}
        {project.communeProjet} d’une puissance de {formatNumber(project.puissance, 1e6)}{' '}
        {appelOffre.unitePuissance}.
      </Text>
    </>
  );
};
