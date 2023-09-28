import { Document, Page, View, Text } from '@react-pdf/renderer';
import React from 'react';
import { Header } from './Header';
import { PageFooter } from './PageFooter';
import { Objet } from './Objet';
import { Introduction } from './Introduction';
import { Signature } from './Signature';
import { PassageConcernantAbandonDuCahierDesCharges } from './PassageConcernantAbandonDuCahierDesCharges';

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

        <View style={{ paddingLeft: 15 }}>
          <View style={{ textAlign: 'justify' }}>
            <Objet />
            <Introduction />

            <PassageConcernantAbandonDuCahierDesCharges />

            <View wrap={false}>
              <Text style={{ marginTop: 30 }}>
                Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations
                distinguées.
              </Text>

              <Signature />
            </View>
          </View>
        </View>

        <PageFooter />
      </Page>
    </Document>
  );
};
