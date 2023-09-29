import { Text } from '@react-pdf/renderer';
import React, { FC } from 'react';

type ObjetProps = {
  appelOffre: {
    nom: string;
    description: string;
    période: string;
  };
};

export const Objet: FC<ObjetProps> = ({ appelOffre: { nom, description, période } }) => {
  return (
    <Text style={{ fontWeight: 'bold', marginTop: 30 }}>
      Objet : Abandon d’un projet lauréat de la {période} période de l’appel d’offres {nom} portant{' '}
      {description}
    </Text>
  );
};
