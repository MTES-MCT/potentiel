import { FC } from 'react';
import Tag from '@codegouvfr/react-dsfr/Tag';

import { DateTime } from '@potentiel-domain/common';

import { ListItem } from '@/components/molecules/ListItem';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Heading3 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export type DocumentItem = {
  type: string;
  date: string;
  format: string;
  url?: string;
  demande?: { date: string };
};

export const DocumentListItem: FC<DocumentItem> = ({ type, date, url, format, demande }) => {
  return (
    <ListItem
      heading={
        <div>
          <Heading3>{type}</Heading3>
        </div>
      }
      actions={
        url ? (
          <DownloadDocument
            className="mb-0"
            url={url}
            format={format}
            label="Télécharger le document"
          />
        ) : (
          <></>
        )
      }
    >
      <div className="flex flex-row gap-2">
        <Tag
          iconId="ri-calendar-2-fill"
          className="bg-dsfr-background-alt-greenTilleulVerveine-default"
        >
          <span>
            Document en date du{' '}
            <FormattedDate date={DateTime.convertirEnValueType(date).formatter()} />
          </span>
        </Tag>
        {demande && (
          <Tag iconId="ri-calendar-2-fill" className="bg-dsfr-background-alt-blueFrance-default">
            <span>
              Demande en date du{' '}
              <FormattedDate date={DateTime.convertirEnValueType(date).formatter()} />
            </span>
          </Tag>
        )}
      </div>
    </ListItem>
  );
};
