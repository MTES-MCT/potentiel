import React from 'react';
import { Font, PDFViewer } from '@react-pdf/renderer';
import { RéponseAbandonAvecRecandidature } from './RéponseAbandonAvecRecandidature';

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

export const Default = () => {
  return (
    <PDFViewer width="100%" height="900px">
      <RéponseAbandonAvecRecandidature />
    </PDFViewer>
  );
};
