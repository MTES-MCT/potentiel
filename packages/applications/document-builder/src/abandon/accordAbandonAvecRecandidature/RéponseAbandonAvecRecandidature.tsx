import { Document, Page, View, Text } from '@react-pdf/renderer';
import React from 'react';

import { Header } from './Header';
import { PageFooter } from './PageFooter';
import { Objet } from './Objet';
import { Introduction } from './Introduction';
import { Signature } from './Signature';
import { PassageConcernantAbandonDuCahierDesCharges } from './PassageConcernantAbandonDuCahierDesCharges';

export type RéponseAbandonAvecRecandidatureProps = {
  dateCourrier: string;
  projet: {
    identifiantProjet: string;
    nomReprésentantLégal: string;
    nomCandidat: string;
    email: string;
    nom: string;
    commune: string;
    codePostal: string;
    dateDésignation: string;
    puissance: number;
  };
  appelOffre: {
    nom: string;
    description: string;
    période: string;
    unitéPuissance: string;
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: string;
      dispositions: string;
    };
  };
  demandeAbandon: {
    date: string;
    instructeur: {
      nom: string;
      fonction: string;
    };
  };
  imagesFolderPath: string;
};

export const RéponseAbandonAvecRecandidature = ({
  dateCourrier,
  projet,
  appelOffre,
  demandeAbandon,
  imagesFolderPath,
}: RéponseAbandonAvecRecandidatureProps) => {
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
        <Header dateCourrier={dateCourrier} projet={projet} imagesFolderPath={imagesFolderPath} />

        <View style={{ paddingLeft: 15 }}>
          <View style={{ textAlign: 'justify' }}>
            <Objet appelOffre={appelOffre} />
            <Introduction projet={projet} appelOffre={appelOffre} demandeAbandon={demandeAbandon} />

            <PassageConcernantAbandonDuCahierDesCharges appelOffre={appelOffre} />

            <View wrap={false}>
              <Text style={{ marginTop: 30 }}>
                Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations
                distinguées.
              </Text>

              <Signature instructeur={demandeAbandon.instructeur} />
            </View>
          </View>
        </View>

        <PageFooter />
      </Page>
    </Document>
  );
};
