import { FC } from 'react';

import { Puissance } from '@potentiel-domain/laureat';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { DemanderChangementPuissanceForm } from './DemanderChangementPuissance.form';

export type DemanderChangementPuissancePageProps = PlainType<Puissance.ConsulterPuissanceReadModel>;

export const DemanderChangementPuissancePage: FC<DemanderChangementPuissancePageProps> = ({
  identifiantProjet,
  puissance,
}) => (
  <PageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
  >
    <Heading1>Demander un changement de puissance</Heading1>
    <DemanderChangementPuissanceForm identifiantProjet={identifiantProjet} puissance={puissance} />
  </PageTemplate>
);
