import { Image, Text, View } from '@react-pdf/renderer';
import React from 'react';

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
            src={`${process.env.BASE_URL}/images/logo-ministere-de-la-transition-energetique.png`}
          />

          <View style={{ width: 165, paddingBottom: 10, fontStyle: 'italic' }}>
            <Text>Direction de l’énergie</Text>
            <Text>Sous-direction du système électrique et des énergies renouvelables</Text>
            <Text>Bureau de la production électrique et des énergies renouvelables</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
