import React from 'react';

export type ListItemProps = {
  heading: React.ReactNode;
  children: React.ReactNode;
  actions: React.ReactNode;
};

export function ListItem({ actions, children, heading }: ListItemProps) {
  return (
    <div className="w-full">
      {heading}
      <div className="flex flex-col md:flex-row md:justify-between gap-2 mt-3 w-full">
        <div className="flex-1">{children}</div>
        <div className="my-4 self-center sm:my-0 sm:self-end">{actions}</div>
      </div>
    </div>
  );
}
