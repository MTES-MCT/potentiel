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
      <div className="flex flex-row justify-between gap-2 mt-3 w-full">
        <div className="flex-1">{children}</div>
        <div className="self-end">{actions}</div>
      </div>
    </div>
  );
}
