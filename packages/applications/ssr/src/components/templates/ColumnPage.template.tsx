import { FC } from 'react';

import { PageTemplate } from './Page.template';

type ColumnPageTemplateProps = {
  banner: React.ReactNode;
  children?: React.ReactNode;
  heading?: React.ReactNode;
  leftColumn: {
    className?: string;
    children: React.ReactNode;
  };
  rightColumn: {
    className?: string;
    children: React.ReactNode;
  };
};

export const ColumnPageTemplate: FC<ColumnPageTemplateProps> = ({
  banner,
  children,
  heading,
  leftColumn,
  rightColumn,
}) => (
  <PageTemplate banner={banner}>
    {heading ?? null}
    <div className="flex flex-col lg:flex-row gap-12 mt-6 items-start">
      <div className={`flex-1 ${leftColumn.className ?? ''}`}>{leftColumn.children}</div>
      <div className={`flex-auto md:max-w-lg items-stretch ${rightColumn.className ?? ''}`}>
        {rightColumn.children}
      </div>
    </div>
    {children ?? null}
  </PageTemplate>
);
