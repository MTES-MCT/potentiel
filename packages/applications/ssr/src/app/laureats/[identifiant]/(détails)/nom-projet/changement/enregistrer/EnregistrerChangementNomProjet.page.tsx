import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import {
  EnregistrerChangementNomProjetForm,
  EnregistrerChangementNomProjetFormProps,
} from './EnregistrerChangementNomProjet.form';

export type EnregistrerChangementNomProjetPageProps = EnregistrerChangementNomProjetFormProps;

export const EnregistrerChangementNomProjetPage: FC<EnregistrerChangementNomProjetPageProps> = ({
  identifiantProjet,
  nomProjet,
}) => (
  <PageTemplate
    banner={
      <ProjetLauréatBanner
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
    }
  >
    <Heading1>Changer le nom du projet</Heading1>
    <EnregistrerChangementNomProjetForm
      identifiantProjet={identifiantProjet}
      nomProjet={nomProjet}
    />
  </PageTemplate>
);
