import { FC } from 'react';

import { Actionnaire } from '@potentiel-domain/laureat';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { TransmettreActionnaireForm } from './TransmettreActionnaire.form';

export type TransmettreActionnairePageProps = {
  identifiantProjet: PlainType<Actionnaire.ConsulterActionnaireReadModel['identifiantProjet']>;
  hasToUploadDocument: boolean;
};

export const TransmettreActionnairePage: FC<TransmettreActionnairePageProps> = ({
  identifiantProjet,
  hasToUploadDocument,
}) => (
  <PageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
  >
    <Heading1>Transmettre l'actionnaire</Heading1>
    <TransmettreActionnaireForm
      identifiantProjet={identifiantProjet}
      hasToUploadDocument={hasToUploadDocument}
    />
  </PageTemplate>
);
