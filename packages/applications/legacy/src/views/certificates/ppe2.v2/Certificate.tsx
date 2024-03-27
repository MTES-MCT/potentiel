import { Document, Page, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { ProjectDataForCertificate } from '../../../modules/project/dtos';
import { Header } from './components/Header';
import { Objet } from './components/Objet';
import { Introduction } from './components/Introduction';
import { Signature } from './components/Signature';
import { PageFooter } from './components/PageFooter';
import { Validateur } from '..';

export type CertificateProps = {
  project: ProjectDataForCertificate;
  content: React.ReactNode;
  validateur: Validateur;
};

export const Certificate = (props: CertificateProps) => {
  const { project, content, validateur } = props;

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
        <Header {...{ project }} />

        <View style={{ paddingLeft: 15 }}>
          <View style={{ textAlign: 'justify' }}>
            <Objet {...{ project }} />
            <Introduction {...{ project }} />

            {content}

            <View wrap={false}>
              <Text style={{ marginTop: 30 }}>
                Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations
                distinguées.
              </Text>

              <Signature validateur={validateur} />
            </View>
          </View>
        </View>

        <PageFooter />
      </Page>
    </Document>
  );
};
