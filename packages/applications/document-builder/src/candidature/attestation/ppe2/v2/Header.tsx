import { Text, View } from '@react-pdf/renderer';
import React from 'react';

import { AttestationPPE2Options } from '../../AttestationCandidatureOptions.js';
import { formatDateForPdf } from '../../helpers/formatDateForPdf.js';

type HeaderProps = {
  project: AttestationPPE2Options;
  logo: React.ReactNode;
};
export const Header = ({ project, logo }: HeaderProps) => {
  const { appelOffre, notifiedOn, nomRepresentantLegal, nomCandidat, email, potentielId } = project;
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
          {logo}

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
            Paris, le {formatDateForPdf(notifiedOn)}
          </Text>

          <View style={{ fontSize: 10 }}>
            <Text>{nomRepresentantLegal}</Text>
            <Text>{nomCandidat}</Text>
            <Text>{email}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        <View style={{ fontSize: 8 }}>
          <Text>Code Potentiel: {potentielId}</Text>
          <Text>Dossier suivi par : {appelOffre.dossierSuiviPar}</Text>
        </View>
      </View>
    </View>
  );
};
