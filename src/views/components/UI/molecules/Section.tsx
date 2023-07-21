import { Heading2 } from '@views/components';
import React, { ComponentProps } from 'react';

type SectionProps = ComponentProps<'div'> & {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

export const Section = ({ title, children, icon, className = '', ...props }: SectionProps) => (
  <section
    className={`m-0 p-4 flex-1 border border-solid border-grey-900-base rounded-[3px] ${className}`}
    {...props}
  >
    <Heading2 className="flex items-center text-2xl border-solid border-x-0 border-t-0 border-b-[1px] border-b-grey-900-base">
      {icon && (
        <span className="mr-[10px]" aria-hidden>
          {icon}
        </span>
      )}
      {title}
    </Heading2>
    {children}
  </section>
);
