import React, { ComponentProps } from 'react';

type ListeVideProps = ComponentProps<'div'> & {
  titre: string;
};

export const ListeVide = ({ titre, className = '', children, ...props }: ListeVideProps) => (
  <div
    className={`flex flex-col p-16 border border-dashed border-grey-625-base ${className}`}
    {...props}
  >
    <div className="mx-auto text-center">
      <p>{titre}</p>
      {children}
    </div>
  </div>
);
