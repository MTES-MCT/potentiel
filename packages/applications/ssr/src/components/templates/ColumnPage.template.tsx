import clsx from 'clsx';
import { FC } from 'react';

type ColumnPageTemplateProps = {
  heading?: React.ReactNode;
  leftColumn: {
    children: React.ReactNode;
  };
  rightColumn: {
    /** @deprecated use classes. */
    className?: string;
    children: React.ReactNode;
  };
  classes?: {
    root?: string;
    left?: string;
    right?: string;
    content?: string;
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
      <div className={clsx(`flex-1`, classes?.left)}>{leftColumn.children}</div>
      <div
        className={clsx(
          `flex-auto md:max-w-lg items-stretch`,
          classes?.right,
          // TODO remove
          rightColumn.className,
        )}
      >
        {rightColumn.children}
      </div>
    </div>
  </div>
);
