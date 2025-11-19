import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { Heading1 } from '@/components/atoms/headings';

import {
  TransmettreDateAchèvementForm,
  TransmettreDateAchèvementFormProps,
} from './TransmettreDateAchèvement.form';

export type TransmettreAttestationConformitéPageProps = TransmettreDateAchèvementFormProps;

export const TransmettreAttestationConformitéPage: FC<
  TransmettreAttestationConformitéPageProps
> = ({ identifiantProjet }) => (
  <PageTemplate banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet} />}>
    <Heading1>Transmettre la date d'achèvement du projet</Heading1>
    <TransmettreDateAchèvementForm identifiantProjet={identifiantProjet} />
  </PageTemplate>
);
