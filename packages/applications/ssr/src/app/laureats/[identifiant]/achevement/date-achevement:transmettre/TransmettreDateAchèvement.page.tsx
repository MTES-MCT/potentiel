import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';

import { TitrePageAttestationConformité } from '../TitrePageAttestationConformité';

import {
  TransmettreDateAchèvementForm,
  TransmettreDateAchèvementFormProps,
} from './TransmettreDateAchèvement.form';

export type TransmettreAttestationConformitéPageProps = TransmettreDateAchèvementFormProps;

export const TransmettreAttestationConformitéPage: FC<
  TransmettreAttestationConformitéPageProps
> = ({ identifiantProjet }) => (
  <PageTemplate banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet} />}>
    <TitrePageAttestationConformité title="Transmettre la date d'achèvement du projet" />

    <TransmettreDateAchèvementForm identifiantProjet={identifiantProjet} />
  </PageTemplate>
);
