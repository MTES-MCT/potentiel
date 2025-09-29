import React from 'react';

export type ListItemProps = {
  heading: React.ReactNode;
  children: React.ReactNode;
  actions: React.ReactNode;
};

export function ListItem({ actions, children, heading }: ListItemProps) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex gap-4 items-start justify-between">
        {heading}
        <div className="max-md:hidden">
          <div className="flex md:max-lg:flex-col gap-2">{actions}</div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">{children}</div>

      <div className="md:hidden">
        <div className="flex md:max-lg:flex-col gap-2">{actions}</div>
      </div>
    </div>
  );
}
