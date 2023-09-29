import { Text, View } from '@react-pdf/renderer';
import React, { FC } from 'react';

type SignatureProps = {
  instructeur: {
    nom: string;
    fonction: string;
  };
};

export const Signature: FC<SignatureProps> = ({ instructeur: { nom, fonction } }) => (
  <View
    style={{
      width: 200,
      marginTop: 30,
      display: 'flex',
      flexDirection: 'column',
      marginLeft: 'auto',
      textAlign: 'center',
    }}
    wrap={false}
  >
    <Text style={{ fontSize: 10, marginTop: 30, textAlign: 'center' }}>{nom}</Text>
    <Text style={{ fontSize: 10, fontWeight: 'bold', marginTop: 10, textAlign: 'center' }}>
      {fonction}
    </Text>
    <Text style={{ fontSize: 9, marginTop: 10, textAlign: 'left', fontStyle: 'italic' }}>
      Validé électroniquement par la plateforme https://potentiel.beta.gouv.fr et conforme à
      l'article L.212-2 du code des relations entre le public et l'administration.
    </Text>
  </View>
);
