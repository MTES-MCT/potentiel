import { Document, Page, View } from '@react-pdf/renderer';
import React from 'react';

import { PageFooter } from './PageFooter.js';

export type CertificateProps = {
  header: React.ReactNode;
  objet: React.ReactNode;
  introduction: React.ReactNode;
  content: React.ReactNode;
  signature: React.ReactNode;
  footnotes?: React.ReactNode;
};

export const Certificate = (props: CertificateProps) => {
  const { header, objet, introduction, content, signature, footnotes } = props;

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
        {header}

        <View style={{ paddingLeft: 15 }}>
          <View style={{ textAlign: 'justify' }}>
            {objet}

            {introduction}

            {content}

            {signature}
          </View>

          {footnotes}
        </View>

        <PageFooter />
      </Page>
    </Document>
  );
};
