import { FC } from 'react';
import { ColumnTemplate } from './Column.templace';

type ColumnPageTemplateProps = {
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
  children,
  heading,
  leftColumn,
  rightColumn,
}) => (
  <>
    <ColumnTemplate heading={heading} leftColumn={leftColumn} rightColumn={rightColumn}>
      {children}
    </ColumnTemplate>
  </>
);
