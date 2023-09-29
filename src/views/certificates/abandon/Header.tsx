import React from 'react';
import { Image, Text, View } from '@react-pdf/renderer';

export const Header = () => {
  return (
    <View style={{ paddingLeft: 15 }}>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <View
          style={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Image
            style={{ width: 135, height: 91, marginBottom: 40 }}
            src={`/images/logo-ministere-de-la-transition-energetique.png`}
          />

          <View style={{ width: 165, paddingBottom: 10, fontStyle: 'italic' }}>
            <Text>Direction de l’énergie</Text>
            <Text>Sous-direction du système électrique et des énergies renouvelables</Text>
            <Text>Bureau de la production électrique et des énergies renouvelables</Text>
          </View>
        </View>
        <View
          style={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              width: 190,
              marginTop: 15,
              marginBottom: 50,
            }}
          >
            Direction générale de l’énergie et du climat
          </Text>

          <Text style={{ fontSize: 10, marginBottom: 90 }}>
            Paris, le [DATE_ACCORD_ABANDON (JJ/MM/AAAA)]
          </Text>

          <View style={{ fontSize: 10 }}>
            <Text>[nomRepresentantLegal_PROJET]</Text>
            <Text>[nomCandidat_PROJET]</Text>
            <Text>[email_PROJET]</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        <View style={{ fontSize: 8 }}>
          <Text>Code Potentiel: [potentielId]</Text>
          <Text>Dossier suivi par : [dossierSuiviPar]</Text>
        </View>
      </View>
    </View>
  );
};
