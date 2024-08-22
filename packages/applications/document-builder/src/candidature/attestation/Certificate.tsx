import { Document, Page, Text, View } from '@react-pdf/renderer';
import React from 'react';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { AttestationCandidatureOptions } from './AttestationCandidatureOptions';
import { Objet } from './components/Objet';
import { Introduction } from './components/Introduction';
import { Signature } from './components/Signature';
import { PageFooter } from './components/PageFooter';
import { Footnote, FootnoteProps } from './components/Footnote';
import { Header } from './components/Header';

export type CertificateProps = {
  project: AttestationCandidatureOptions;
  children: React.ReactNode;
  validateur: AppelOffre.Validateur;
  footnotes?: Array<FootnoteProps>;
};

export const Certificate = (props: CertificateProps) => {
  const { project: projet, children, validateur, footnotes } = props;

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
        <Header project={projet} />

        <View style={{ paddingLeft: 15 }}>
          <View style={{ textAlign: 'justify' }}>
            <Objet
              période={projet.période}
              appelOffre={projet.appelOffre}
              isClasse={projet.isClasse}
            />
            <Introduction project={projet} />

            {children}

            <View wrap={false}>
              <Text style={{ marginTop: 30 }}>
                Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations
                distinguées.
              </Text>

              <Signature validateur={validateur} />
            </View>
          </View>

          {footnotes && footnotes.length && (
            <View
              style={{
                marginTop: 100,
                fontSize: 8,
              }}
            >
              {footnotes.map((footnote, index) => (
                <Footnote {...footnote} key={`foot_note_${index}`} />
              ))}
            </View>
          )}
        </View>

        <PageFooter />
      </Page>
    </Document>
  );
};
