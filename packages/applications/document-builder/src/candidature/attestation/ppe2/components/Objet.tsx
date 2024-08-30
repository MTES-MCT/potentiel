import { Text } from '@react-pdf/renderer';
import React from 'react';

import { AppelOffre } from '@potentiel-domain/appel-offre';

type ObjetProps = {
  appelOffre: AppelOffre.AppelOffreReadModel;
  période: AppelOffre.Periode;
  isClasse: boolean;
};

export const Objet = ({ appelOffre, période, isClasse }: ObjetProps) => {
  return (
    <Text style={{ fontWeight: 'bold', marginTop: 30 }}>
      Objet :{' '}
      {isClasse
        ? `Désignation des lauréats de la ${période.title} période de l'appel d'offres ${période.cahierDesCharges.référence} ${appelOffre.title}`
        : `Avis de rejet à l’issue de la ${période.title} période de l'appel d'offres ${période.cahierDesCharges.référence} ${appelOffre.title}`}
    </Text>
  );
};
