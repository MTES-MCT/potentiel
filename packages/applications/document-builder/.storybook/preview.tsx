import path from 'path';
import React from 'react';
import { Font, PDFViewer } from '@react-pdf/renderer';
import type { Preview } from '@storybook/react';

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

const preview: Preview = {
  decorators: [
    (Story) => {
      return (
        <PDFViewer width="100%" height="1200px">
          <Story />
        </PDFViewer>
      );
    },
  ],
};

export default preview;
