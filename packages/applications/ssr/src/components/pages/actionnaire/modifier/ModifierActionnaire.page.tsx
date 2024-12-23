import { FC } from 'react';

import { Actionnaire } from '@potentiel-domain/laureat';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { ModifierActionnaireForm } from './ModifierActionnaire.form';

export type ModifierActionnairePageProps = PlainType<Actionnaire.ConsulterActionnaireReadModel> & {
  hasToUploadDocument: boolean;
};

export const ModifierActionnairePage: FC<ModifierActionnairePageProps> = ({
  identifiantProjet,
  actionnaire,
  hasToUploadDocument,
}) => (
  <PageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
  >
    <Heading1>Modifier l'actionnaire</Heading1>
    <ModifierActionnaireForm
      identifiantProjet={identifiantProjet}
      actionnaire={actionnaire}
      hasToUploadDocument={hasToUploadDocument}
    />
  </PageTemplate>
);
