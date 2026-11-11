import clsx from 'clsx';
import type { FC } from 'react';

type ColumnPageTemplateProps = {
  heading?: React.ReactNode;
  leftColumn: React.ReactNode;
  rightColumn?: React.ReactNode;
  classes?: {
    root?: string;
    content?: string;
    left?: string;
    right?: string;
  };
};

export const ColumnPageTemplate: FC<ColumnPageTemplateProps> = ({
  heading,
  leftColumn,
  rightColumn,
  classes,
}) => (
  <div className={clsx('flex flex-col w-full', classes?.root)}>
    {heading ?? null}
    <div className={clsx('flex flex-col lg:flex-row gap-12 mt-6 items-start', classes?.content)}>
      <div className={clsx(`flex-1 w-full`, classes?.left)}>{leftColumn}</div>
      {rightColumn ? (
        <div className={clsx(`flex-auto md:max-w-lg items-stretch`, classes?.right)}>
          {rightColumn}
        </div>
      ) : null}
    </div>
  </div>
);
