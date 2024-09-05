import { Image, Text, View } from '@react-pdf/renderer';
import React from 'react';

import { AttestationCandidatureOptions } from '../AttestationCandidatureOptions';
import { formatDateForPdf } from '../helpers/formatDateForPdf';
import { imagesFolderPath } from '../../../assets';

type HeaderProps = {
  project: AttestationCandidatureOptions;
};
export const Header = ({ project }: HeaderProps) => {
  const { appelOffre } = project;
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
            style={{ width: 151, height: 85, marginBottom: 40 }}
            src={`${imagesFolderPath}/logo_MEFSIN.png`}
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
            Paris, le {formatDateForPdf(project.notifiedOn)}
          </Text>

          <View style={{ fontSize: 10 }}>
            <Text>{project.nomRepresentantLegal}</Text>
            <Text>{project.nomCandidat}</Text>
            <Text>{project.email}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        <View style={{ fontSize: 8 }}>
          <Text>Code Potentiel: {project.potentielId}</Text>
          <Text>Dossier suivi par : {appelOffre.dossierSuiviPar}</Text>
        </View>
      </View>
    </View>
  );
};
