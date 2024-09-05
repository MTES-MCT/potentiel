import { Page, Document, Text } from '@react-pdf/renderer';
import React from 'react';

export const TestDocument = () => {
  return (
    <Document>
      <Page
        size="A4"
        style={{
          backgroundColor: '#FFF',
          fontFamily: 'Arimo',
          fontSize: 10,
          padding: 40,
          paddingBottom: 70,
        }}
      >
        <Text>HELLO WORLD</Text>
      </Page>
    </Document>
  );
};
