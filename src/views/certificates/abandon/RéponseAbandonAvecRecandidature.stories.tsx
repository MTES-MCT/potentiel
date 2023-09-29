import React from 'react';
import { Font, PDFViewer } from '@react-pdf/renderer';
import {
  RéponseAbandonAvecRecandidature,
  RéponseAbandonAvecRecandidatureProps,
} from './RéponseAbandonAvecRecandidature';

export default { title: 'Documents/Abandon/RéponseAbandonAvecRecandidature' };

Font.register({
  family: 'Arimo',
  fonts: [
    {
      src: '/fonts/arimo/Arimo-Regular.ttf',
    },
    {
      src: '/fonts/arimo/Arimo-Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: '/fonts/arimo/Arimo-Italic.ttf',
      fontStyle: 'italic',
    },
  ],
});

const props: RéponseAbandonAvecRecandidatureProps = {
  dateCourrier: 'JJ/MM/AAAA',
  projet: {
    potentielId: 'Eolien - 1 - 12 8da8c',
    nomReprésentantLégal: 'Marcel Pagnol',
    nomCandidat: 'Lili des Bellons',
    email: 'marcel.pagnol@boulodrome-de-marseille.fr',
    nom: 'Le Boulodrome de Marseille',
    commune: 'Marseille',
    codePostal: '13000',
    dateDésignation: 'JJ/MM/AAAA',
    puissance: 13,
  },
  appelOffre: {
    nom: 'Eolien',
    description:
      'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie mécanique du vent implantées à terre',
    période: 'deuxième',
    unitéPuissance: 'MW',
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.3 et 6.6',
      dispositions: `Le Candidat dont l’offre a été retenue réalise l’Installation dans les conditions du présent cahier des charges et conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.4).

En cas de retrait de l’autorisation environnementale mentionnée au 3.3.3 par l’autorité compétente, d’annulation de cette autorisation à la suite d’un contentieux, ou, dans le cadre des première et troisième période, d’un rejet de sa demande pour cette même autorisation, le Candidat dont l’offre a été sélectionnée peut se désister. Il en fait la demande au ministre chargé de l’énergie sans délai et il est dans ce cas délié de ses obligations au titre du présent appel d’offres.`,
    },
  },
  demandeAbandon: {
    date: 'JJ/MM/AAAA',
    instructeur: {
      nom: 'Augustine Pagnol',
      fonction: 'DGEC',
    },
  },
};

export const Default = () => {
  return (
    <PDFViewer width="100%" height="900px">
      <RéponseAbandonAvecRecandidature {...props} />
    </PDFViewer>
  );
};
