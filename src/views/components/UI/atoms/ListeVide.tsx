import React, { ComponentProps } from 'react';

type ListeVideProps = ComponentProps<'div'> & {
  titre: string;
};

export const ListeVide = ({ titre, className = '', ...props }: ListeVideProps) => (
  <div className={`flex p-16 border border-dashed border-grey-625-base ${className}`} {...props}>
    <span className="mx-auto text-center">{titre}</span>
  </div>
);
