import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { InviterPorteurForm, InviterPorteurFormProps } from './InviterPorteur.form';

export type InviterPorteurPageProps = InviterPorteurFormProps;

export const InviterPorteurPage: FC<InviterPorteurPageProps> = ({ identifiantProjet }) => (
  <ColumnPageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
    leftColumn={{
      children: <InviterPorteurForm identifiantProjet={identifiantProjet} />,
    }}
    rightColumn={{
      children: <></>,
    }}
  />
);
