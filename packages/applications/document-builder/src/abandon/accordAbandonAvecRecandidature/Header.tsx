import React, { FC } from 'react';
import { Image, Text, View } from '@react-pdf/renderer';

import { formatDateForDocument } from '../../_utils/index.js';

type HeaderProps = {
  dateCourrier: string;
  projet: {
    identifiantProjet: string;
    nomReprésentantLégal: string;
    nomCandidat: string;
    email: string;
  };
  imagesFolderPath: string;
};

export const Header: FC<HeaderProps> = ({
  dateCourrier,
  projet: { identifiantProjet, nomReprésentantLégal, nomCandidat, email },
  imagesFolderPath,
}) => {
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
            style={{ maxWidth: 120, marginTop: 15, marginBottom: 40 }}
            src={`${imagesFolderPath}/logo_gouvernement.png`}
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
            Paris, le {formatDateForDocument(new Date(dateCourrier))}
          </Text>

          <View style={{ fontSize: 10 }}>
            <Text>{nomReprésentantLégal}</Text>
            <Text>{nomCandidat}</Text>
            <Text>{email}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        <View style={{ fontSize: 8 }}>
          <Text>Code Potentiel: {identifiantProjet}</Text>
          <Text>Dossier suivi par : aopv.dgec@developpement-durable.gouv.fr</Text>
        </View>
      </View>
    </View>
  );
};
