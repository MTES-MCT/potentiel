import { Image, Text, View } from '@react-pdf/renderer';
import type { FC } from 'react';

import { formatDateForDocument } from '../_utils/index.js';

type HeaderProps = {
  dateDocument: string;
  imagesFolderPath: string;
};

export const Header: FC<HeaderProps> = ({ dateDocument, imagesFolderPath }) => {
  return (
    <View style={{ paddingLeft: 15, marginBottom: 30 }}>
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

          <Text style={{ fontSize: 10, marginBottom: 20 }}>
            Paris, le {formatDateForDocument(new Date(dateDocument))}
          </Text>

          <View style={{ width: 300, paddingBottom: 10, fontStyle: 'italic' }}>
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
              width: 300,
              marginTop: 15,
              marginBottom: 50,
            }}
          >
            Direction Générale de l’Énergie et du Climat
          </Text>
        </View>
      </View>
    </View>
  );
};
