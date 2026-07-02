import { Document, Page, View } from '@react-pdf/renderer';

import type { DonnéesDocument } from './buildDocument.js';
import { Header } from './Header.js';
import { Introduction } from './Introduction.js';
import { PageFooter } from './PageFooter.js';
import { TableauLauréatPériode } from './TableauLauréatsPériode.js';

export type SynthèsePériodeProps = DonnéesDocument & { imagesFolderPath: string };

export const chunkArray = <T,>(
  array: T[],
  firstPageSize: number,
  otherPagesSize: number,
): T[][] => {
  const result: T[][] = [];

  let index = 0;

  // première page
  result.push(array.slice(index, index + firstPageSize));
  index += firstPageSize;

  // pages suivantes
  while (index < array.length) {
    result.push(array.slice(index, index + otherPagesSize));
    index += otherPagesSize;
  }

  return result;
};

export const SynthèsePériode = ({
  dateCourrier,
  synthèse,
  lauréats,
  imagesFolderPath,
  période,
}: SynthèsePériodeProps) => {
  const firstPageSize = 10;
  const otherPagesSize = 25;
  const pages = chunkArray(lauréats, firstPageSize, otherPagesSize);

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
          </View>
          <TableauLauréatPériode
            key={pages[0]?.[0].nomProjet}
            lauréats={pages[0]}
            indexPage={0}
            pagesLength={pages.length}
          />
        </View>

        <PageFooter />
      </Page>
      {pages.map(
        (page, index) =>
          index > 0 && (
            <Page
              key={`${page[0].nomProjet}-page`}
              size="A4"
              style={{
                backgroundColor: '#FFF',
                fontFamily: 'Arimo',
                fontSize: 10,
                padding: 40,
                paddingBottom: 70,
              }}
            >
              <View style={{ paddingLeft: 15 }}>
                <TableauLauréatPériode
                  key={`${page[0].nomProjet}-tableau`}
                  lauréats={page}
                  indexPage={index}
                  pagesLength={pages.length}
                />
              </View>
              <PageFooter />
            </Page>
          ),
      )}
    </Document>
  );
};
