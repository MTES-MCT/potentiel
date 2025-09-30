import React from 'react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { FormattedDate } from '../atoms/FormattedDate';

export type ListItemProps = {
  heading: React.ReactNode;
  children: React.ReactNode;
  actions: React.ReactNode;
  misÀJourLe?: Iso8601DateTime;
};

export const ListItem: React.FC<ListItemProps> = ({ actions, children, heading, misÀJourLe }) => (
  <div className="flex flex-1 flex-col">
    <div className="flex gap-4 items-start justify-between">
      {heading}
      <div className="max-md:hidden flex md:max-lg:flex-col gap-2 shrink-0">{actions}</div>
    </div>

    <div className="flex flex-col justify-between gap-2 mt-4 lg:flex-row lg:gap-4 md:items-end">
      <div>{children}</div>
      {misÀJourLe && (
        <div className="shrink-0 lg:text-right italic text-xs">
          Dernière mise à jour le <FormattedDate date={misÀJourLe} />
        </div>
      )}
    </div>

    <div className="flex mt-6 justify-center items-center md:max-lg:flex-col gap-2 md:hidden">
      {actions}
    </div>
  </div>
);
