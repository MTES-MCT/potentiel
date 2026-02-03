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
          <div className="flex flex-col gap-4 mt-4 list-none">
            {documents.map(({ type, url, date, format, demande }) => (
              <li key={type + date}>
                <Tile className="flex flex-col md:flex-row md:justify-between">
                  <DocumentListItem
                    type={type}
                    url={url}
                    format={format}
                    date={date}
                    demande={demande}
                  />
                </Tile>
              </li>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
