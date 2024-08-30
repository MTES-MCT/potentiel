import { Document, Page, Text, View } from '@react-pdf/renderer';
import React from 'react';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { AttestationCandidatureOptions } from '../../AttestationCandidatureOptions';

import { Objet } from './Objet';
import { Signature } from './Signature';
import { PageFooter } from './PageFooter';

export type CertificateProps = {
  project: AttestationCandidatureOptions;
  children: React.ReactNode;
  validateur: AppelOffre.Validateur;
  footnotes?: React.ReactNode;
  header: React.ReactNode;
  introduction: React.ReactNode;
};

export const Certificate = (props: CertificateProps) => {
  const { project: projet, children, validateur, header, footnotes } = props;

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
            <Objet
              période={projet.période}
              appelOffre={projet.appelOffre}
              isClasse={projet.isClasse}
            />

            {children}

            <View wrap={false}>
              <Text style={{ marginTop: 30 }}>
                Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations
                distinguées.
              </Text>

              <Signature validateur={validateur} />
            </View>
          </View>

          {footnotes}
        </View>

        <PageFooter />
      </Page>
    </Document>
  );
};
