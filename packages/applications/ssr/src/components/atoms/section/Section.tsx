import clsx from 'clsx';
import type React from 'react';
import type { ComponentProps } from 'react';

import type { Utilisateur } from '@potentiel-domain/utilisateur';

import { Heading3 } from '@/components/atoms/headings';
import { DéfinirFiltresForm } from './filters/DéfinirFiltres.form';

type SectionProps = ComponentProps<'section'> & {
  title: string;
  children: React.ReactNode;
  filters?: Utilisateur.Filters;
  picto?: React.ReactNode;
  icon?: React.ReactNode;
};

export const Section = ({ title, children, picto, className = '', filters }: SectionProps) => (
  <section
    className={clsx(
      'w-full h-fit flex flex-col gap-2 p-3 border-solid border border-dsfr-border-default-grey-default rounded-[3px] ',
      'print:break-inside-avoid',
      className,
    )}
  >
    <div className="flex flex-row items-center gap-8">
      <Heading3 as="h2" className="flex gap-4 items-center mb-1">
        {picto && <span>{picto}</span>}
        {title}
      </Heading3>
      {filters && <DéfinirFiltresForm userFilters={filters} />}
    </div>
    {children}
  </section>
);
