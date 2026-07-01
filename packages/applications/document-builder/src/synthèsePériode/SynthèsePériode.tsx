import { Document, Page, View } from '@react-pdf/renderer';

import type { DonnéesDocument } from './buildDocument.js';
import { Header } from './Header.js';
import { Introduction } from './Introduction.js';
import { PageFooter } from './PageFooter.js';
import { TableauLauréatPériode } from './TableauLauréatsPériode.js';

export type SynthèsePériodeProps = DonnéesDocument & { imagesFolderPath: string };

export const SynthèsePériode = ({
  dateCourrier,
  synthèse,
  lauréats,
  imagesFolderPath,
  période,
}: SynthèsePériodeProps) => {
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
        <Header dateDocument={dateCourrier} imagesFolderPath={imagesFolderPath} />

        <View style={{ paddingLeft: 15 }}>
          <View style={{ textAlign: 'justify' }}>
            <Introduction période={période} synthèse={synthèse} />

            <TableauLauréatPériode lauréats={lauréats} unitéPuissance={période.unitéPuissance} />
          </View>
        </View>

        <PageFooter />
      </Page>
    </Document>
  );
};
