import { Document, Page } from '@react-pdf/renderer';
import React from 'react';
import { Header } from './Header';
import { PageFooter } from './PageFooter';

export const RéponseAbandonAvecRecandidature = () => {
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
        <Header />

        <PageFooter />
      </Page>
    </Document>
  );
};
