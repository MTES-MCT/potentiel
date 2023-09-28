import { Text } from '@react-pdf/renderer';
import React from 'react';

export const Introduction = () => {
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
        Par courrier du [JJ/MM/AAAA], il vous a été notifié la désignation du projet ci-dessous
        comme lauréat de l’appel d’offres cité en objet.
      </Text>

      <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10, marginBottom: 10 }}>
        Par votre demande reçue dans nos services le [JJ/MM/AAAA], vous m’informez que votre société
        ne sera pas en mesure de réaliser ce projet du fait des conditions économiques. Vous
        m’informez également que vous souhaitez abandonner votre statut de lauréat afin de pouvoir
        candidater à une future période d’appel d’offres, avant le 31 décembre 2024.
      </Text>
    </>
  );
};
