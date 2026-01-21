import { Text, View } from '@react-pdf/renderer';
import React, { FC } from 'react';

import { formatDateForDocument } from '../../_utils';

type IntroductionProps = {
  projet: {
    nom: string;
    commune: string;
    codePostal: string;
    dateDésignation: string;
    puissance: number;
    unitéPuissance: string;
  };
  demandeAbandon: {
    date: string;
  };
};

export const Introduction: FC<IntroductionProps> = ({
  projet: { dateDésignation, nom, commune, codePostal, puissance, unitéPuissance },
  demandeAbandon: { date: dateDemandeAbandon },
}) => {
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
        Par courrier du {formatDateForDocument(new Date(dateDésignation))}, il vous a été notifié la
        désignation du projet ci-dessous comme lauréat de l’appel d’offres cité en objet.
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
            <Text>({unitéPuissance})</Text>
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
          <Text style={{ padding: 10, borderRight: '1px solid #000', width: 110 }}>{nom}</Text>
          <Text style={{ padding: 10, borderRight: '1px solid #000', width: 110 }}>
            {puissance}
          </Text>
          <Text style={{ padding: 10, width: 110 }}>
            {commune} ({codePostal})
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10, marginBottom: 10 }}>
        Par votre demande reçue dans nos services le{' '}
        {formatDateForDocument(new Date(dateDemandeAbandon))}, vous m’informez que votre société ne
        sera pas en mesure de réaliser ce projet du fait des conditions économiques. Vous m’informez
        également que vous souhaitez abandonner votre statut de lauréat afin de pouvoir candidater à
        une future période d’appel d’offres, avant le 31 décembre 2024.
      </Text>
    </>
  );
};
