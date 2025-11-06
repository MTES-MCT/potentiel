import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { EnregistrerChangementInstallateurForm } from './EnregistrerChangementInstallateur.form';

export type EnregistrerChangementInstallateurPageProps =
  PlainType<Lauréat.Installation.ConsulterInstallateurReadModel>;

export const EnregistrerChangementInstallateurPage: FC<
  EnregistrerChangementInstallateurPageProps
> = ({ identifiantProjet, installateur }) => (
  <PageTemplate
    banner={
      <ProjetLauréatBanner
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
    }
  >
    <Heading1>Changer l'installateur</Heading1>
    <EnregistrerChangementInstallateurForm
      identifiantProjet={identifiantProjet}
      installateur={installateur}
    />
  </PageTemplate>
);
