import { Heading2 } from '@views/components';
import React, { ComponentProps } from 'react';

type SectionProps = ComponentProps<'div'> & {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

export const Section = ({ title, children, icon, className = '', ...props }: SectionProps) => (
  <section
    className={`m-0 p-4 flex-1 xs:w-full min-w-fit border border-solid border-grey-900-base rounded-[3px] shadow-md ${className}`}
    {...props}
  >
    <Heading2 className="flex items-center text-2xl border-solid border-x-0 border-t-0 border-b-[1px] border-b-grey-900-base mt-0 pb-3">
      {Icon && <Icon className="mr-[10px]" aria-hidden />}
      {title}
    </Heading2>
    {children}
  </section>
);
