import { Image, Text, View } from '@react-pdf/renderer';
import React from 'react';

import { AttestationCandidatureOptions } from '../../AttestationCandidatureOptions';
import { formatDateForPdf } from '../../helpers/formatDateForPdf';

type HeaderProps = {
  project: AttestationCandidatureOptions;
  imagesRootPath: string;
};
export const Header = ({ project, imagesRootPath }: HeaderProps) => {
  const { appelOffre, période } = project;

  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Image style={{ width: 165, height: 118 }} src={imagesRootPath + '/logo_MTE.png'} />
        <Text style={{ fontSize: 12, fontWeight: 'bold', width: 190, paddingTop: 10 }}>
          Direction générale de l’énergie et du climat
        </Text>
      </View>
      <View style={{ paddingLeft: 15 }}>
        <Text style={{ fontSize: 8, textAlign: 'right' }}>
          Paris, le {formatDateForPdf(project.notifiedOn)}
        </Text>

        <View style={{ width: 165, paddingBottom: 10, fontStyle: 'italic' }}>
          <Text>Direction de l’énergie</Text>
          <Text>Sous-direction du système électrique et des énergies renouvelables</Text>
          <Text>Bureau de la production électrique et des énergies renouvelables</Text>
        </View>

        <View style={{ fontSize: 8 }}>
          <Text>Code Potentiel: {project.potentielId}</Text>
          <Text>Dossier suivi par : {période.dossierSuiviPar || appelOffre.dossierSuiviPar}</Text>
        </View>

        <View style={{ textAlign: 'right', paddingTop: 20 }}>
          <Text>{project.nomRepresentantLegal}</Text>
          <Text>{project.nomCandidat}</Text>
          <Text>{project.email}</Text>
        </View>
      </View>
    </>
  );
};
