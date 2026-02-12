import { FC } from 'react';
import Tag from '@codegouvfr/react-dsfr/Tag';

import { DateTime } from '@potentiel-domain/common';

import { ListItem } from '@/components/molecules/ListItem';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Heading3 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export type DocumentItem = {
  type: string;
  format: string;
  date?: string;
  url?: string;
  demande?: { url: string };
};

export const DocumentListItem: FC<DocumentItem> = ({ type, date, url, format, demande }) => {
  return (
    <ListItem
      heading={<Heading3>{type}</Heading3>}
      actions={
        url && (
          <DownloadDocument
            className="mb-0"
            url={url}
            format={format}
            label="Télécharger le document"
          />
        )
      }
    >
      <div className="flex flex-row gap-2">
        {/* on affiche pas la date pour l'export projet */}
        {date && (
          <Tag
            iconId="ri-calendar-2-fill"
            className="bg-dsfr-background-alt-greenTilleulVerveine-default"
          >
            <FormattedDate date={DateTime.convertirEnValueType(date).formatter()} />
          </Tag>
        )}
        {demande && (
          <Tag
            iconId="ri-external-link-line"
            className="bg-dsfr-background-alt-blueFrance-default"
            linkProps={{
              href: demande.url,
            }}
          >
            <span>Détails de la demande</span>
          </Tag>
        )}
      </div>
    </ListItem>
  );
};
