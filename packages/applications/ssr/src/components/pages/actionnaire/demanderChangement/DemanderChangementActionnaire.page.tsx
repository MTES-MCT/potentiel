import { FC } from 'react';

import { Actionnaire } from '@potentiel-domain/laureat';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { DemanderChangementActionnaireForm } from './DemanderChangementActionnaire.form';

export type DemanderChangementActionnairePageProps =
  PlainType<Actionnaire.ConsulterActionnaireReadModel>;

export const DemanderChangementActionnairePage: FC<DemanderChangementActionnairePageProps> = ({
  identifiantProjet,
  actionnaire,
}) => (
  <PageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
  >
    <Heading1>Demander le changement de l'actionnaire</Heading1>
    <DemanderChangementActionnaireForm
      identifiantProjet={identifiantProjet}
      actionnaire={actionnaire}
    />
  </PageTemplate>
);