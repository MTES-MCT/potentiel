import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { CahierDesCharges, Lauréat } from '@potentiel-domain/projet';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { DemanderChangementPuissanceForm } from './DemanderChangementPuissance.form';

export type DemanderChangementPuissancePageProps = PlainType<
  Lauréat.Puissance.ConsulterPuissanceReadModel & {
    cahierDesCharges: PlainType<CahierDesCharges.ValueType>;
    volumeRéservé?: PlainType<Lauréat.Puissance.VolumeRéservé.ValueType>;
  }
>;

export const DemanderChangementPuissancePage: FC<DemanderChangementPuissancePageProps> = ({
  identifiantProjet,
  puissance,
  cahierDesCharges,
  volumeRéservé,
  unitéPuissance,
  puissanceInitiale,
}) => (
  <PageTemplate
    banner={
      <ProjetLauréatBanner
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
    }
  >
    <Heading1>Changer de puissance</Heading1>
    <DemanderChangementPuissanceForm
      identifiantProjet={identifiantProjet}
      puissance={puissance}
      cahierDesCharges={cahierDesCharges}
      volumeRéservé={volumeRéservé}
      unitéPuissance={unitéPuissance}
      puissanceInitiale={puissanceInitiale}
    />
  </PageTemplate>
);
