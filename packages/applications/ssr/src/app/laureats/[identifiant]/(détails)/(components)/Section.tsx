import React, { ComponentProps } from 'react';
import clsx from 'clsx';

import { Heading3 } from '@/components/atoms/headings';

type SectionProps = ComponentProps<'div'> & {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

export const Section = ({ title, children, className = '' }: SectionProps) => (
  <section
    className={clsx(
      'w-full h-fit flex flex-col gap-2 p-3 border-solid border border-dsfr-border-default-grey-default rounded-[3px]',
      className,
    )}
  >
    <Heading3 className="flex items-center mb-1">{title}</Heading3>
    {children}
  </section>
);
