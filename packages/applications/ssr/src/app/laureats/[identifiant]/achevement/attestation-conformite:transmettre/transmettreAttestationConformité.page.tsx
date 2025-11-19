import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { Heading1 } from '@/components/atoms/headings';

import {
  AttestationConformitéForm,
  AttestationConformitéFormProps,
} from '../AttestationConformité.form';
import { InfoBoxAttestationConformité } from '../InfoAttestationConformité';

import { transmettreAttestationConformitéAction } from './transmettreAttestationConformité.action';

export type TransmettreAttestationConformitéPageProps = Pick<
  AttestationConformitéFormProps,
  'demanderMainlevée' | 'identifiantProjet'
>;

export const TransmettreAttestationConformitéPage: FC<
  TransmettreAttestationConformitéPageProps
> = ({ identifiantProjet, demanderMainlevée }) => (
  <PageTemplate banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet} />}>
    <Heading1>Transmettre l'attestation de conformité du projet</Heading1>
    <InfoBoxAttestationConformité />
    <AttestationConformitéForm
      identifiantProjet={identifiantProjet}
      action={transmettreAttestationConformitéAction}
      submitLabel="Transmettre"
      demanderMainlevée={demanderMainlevée}
    />
  </PageTemplate>
);
