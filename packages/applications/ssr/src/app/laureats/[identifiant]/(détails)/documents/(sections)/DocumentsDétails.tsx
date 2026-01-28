import { Tile } from '../../../../../../components/organisms/Tile';

import { DocumentListItem } from './DocumentListItem';

export type DocumentItem = {
  type: string;
  date: string;
  format: string;
  documentKey: string;
  peutÊtreTéléchargé: boolean;
};

export type DocumentListItemProps = { documents: Array<DocumentItem> };

const mapTypeToTypeLabel = (type: string): string => {
  const typeToTypeLabelMapper: Record<string, string> = {
    attestation: 'Attestation de désignation',
  };

  return typeToTypeLabelMapper[type] ?? type;
};

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
            {documents.map(({ type, documentKey, date, peutÊtreTéléchargé }) => (
              <li key={documentKey}>
                <Tile className="flex flex-col md:flex-row md:justify-between">
                  <DocumentListItem
                    type={mapTypeToTypeLabel(type)}
                    documentKey={documentKey}
                    date={date}
                    peutÊtreTéléchargé={peutÊtreTéléchargé}
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
