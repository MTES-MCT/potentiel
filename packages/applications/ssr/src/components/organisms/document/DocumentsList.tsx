import { Tile } from '@/components/organisms/Tile';

import { DocumentItem, DocumentListItem } from './DocumentListItem';

export type DocumentListItemProps = { documents: Array<DocumentItem> };

export const DocumentsList = ({ documents }: DocumentListItemProps) => {
  return (
    <>
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-16">
          <p className="text-lg font-semibold">Aucun document n'a été transmis pour ce projet</p>
        </div>
      ) : (
        <div>
          <div className="flex flex-col gap-4 mt-4">
            {documents.map(
              ({ type, documentKey, url, date, peutÊtreTéléchargé, format, demande }) => (
                <li key={documentKey}>
                  <Tile className="flex flex-col md:flex-row md:justify-between">
                    <DocumentListItem
                      type={type}
                      documentKey={documentKey}
                      url={url}
                      format={format}
                      date={date}
                      demande={demande}
                      peutÊtreTéléchargé={peutÊtreTéléchargé}
                    />
                  </Tile>
                </li>
              ),
            )}
          </div>
        </div>
      )}
    </>
  );
};
