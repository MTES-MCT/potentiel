import { Text, View } from '@react-pdf/renderer';
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
        Par courrier du [DATE_DESIGNATION (JJ/MM/AAAA)], il vous a été notifié la désignation du
        projet ci-dessous comme lauréat de l’appel d’offres cité en objet.
      </Text>

      <View
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 10,
          border: '1px solid #000',
          textAlign: 'center',
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#ddd',
            borderBottom: '1px solid #000',
          }}
        >
          <Text style={{ padding: 10, borderRight: '1px solid #000', width: 110 }}>
            Nom du projet
          </Text>
          <View style={{ padding: 10, borderRight: '1px solid #000', width: 110 }}>
            <Text>Puissance</Text>
            <Text>([UNITE_PUISSANCE_APPEL_OFFRE])</Text>
          </View>
          <View style={{ padding: 10, width: 110 }}>
            <Text>Commune</Text>
            <Text>d'implantation</Text>
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Text style={{ padding: 10, borderRight: '1px solid #000', width: 110 }}>
            [NOM DU PROJET]
          </Text>
          <Text style={{ padding: 10, borderRight: '1px solid #000', width: 110 }}>
            [PUISSANCE_PROJET]
          </Text>
          <Text style={{ padding: 10, width: 110 }}>[NOM DE LA COMMUNE (CODE POSTAL)]</Text>
        </View>
      </View>

      <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10, marginBottom: 10 }}>
        Par votre demande reçue dans nos services le [DATE_DEMANDE_ABANDON (JJ/MM/AAAA)], vous
        m’informez que votre société ne sera pas en mesure de réaliser ce projet du fait des
        conditions économiques. Vous m’informez également que vous souhaitez abandonner votre statut
        de lauréat afin de pouvoir candidater à une future période d’appel d’offres, avant le 31
        décembre 2024.
      </Text>
    </>
  );
};
