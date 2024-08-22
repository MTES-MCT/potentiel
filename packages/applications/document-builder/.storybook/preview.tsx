import path from 'path';
import React from 'react';
import { Font, PDFViewer } from '@react-pdf/renderer';
import type { Preview } from '@storybook/react';

const assetsFolder = path.resolve('../src/assets');
const fontsFolderPath = path.resolve(assetsFolder, 'fonts');

Font.register({
  family: 'Arimo',
  fonts: [
    {
      src: path.join(fontsFolderPath, '/arimo/Arimo-Regular.ttf'),
    },
    {
      src: path.join(fontsFolderPath, '/arimo/Arimo-Bold.ttf'),
      fontWeight: 'bold',
    },
    {
      src: path.join(fontsFolderPath, '/arimo/Arimo-Italic.ttf'),
      fontStyle: 'italic',
    },
  ],
});

const preview: Preview = {
  decorators: [
    (Story) => {
      return (
        <PDFViewer width="100%" height="900px">
          <Story />
        </PDFViewer>
      );
    },
  ],
};

export default preview;
