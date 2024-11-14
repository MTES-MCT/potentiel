import { FC } from 'react';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1 } from '@/components/atoms/headings';

import {
  CorrigerReprésentantLégalForm,
  CorrigerReprésentantLégalFormProps,
} from './CorrigerReprésentantLégal.form';

export type CorrigerReprésentantLégalPageProps = CorrigerReprésentantLégalFormProps;

export const CorrigerReprésentantLégalPage: FC<CorrigerReprésentantLégalPageProps> = ({
  identifiantProjet,
  nomRepresentantLegal,
}) => {
  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
      heading={<Heading1>Corriger le représentant légal</Heading1>}
      leftColumn={{
        children: (
          <CorrigerReprésentantLégalForm
            identifiantProjet={identifiantProjet}
            nomRepresentantLegal={nomRepresentantLegal}
          />
        ),
      }}
      rightColumn={{
        children: <></>,
      }}
    />
  );
};
