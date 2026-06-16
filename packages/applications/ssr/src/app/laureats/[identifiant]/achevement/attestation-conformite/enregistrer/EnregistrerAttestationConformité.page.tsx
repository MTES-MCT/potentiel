import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import {
  EnregistrerAttestationConformitéForm,
  type EnregistrerAttestationConformitéFormProps,
} from './EnregistrerAttestationConformité.form';

export type EnregistrerAttestationConformitéPageProps = EnregistrerAttestationConformitéFormProps;

export const EnregistrerAttestationConformitéPage: FC<
  EnregistrerAttestationConformitéPageProps
> = ({ identifiantProjet, attestationConformité }) => (
  <>
    <Heading1>Enregistrer l'attestation de conformité et le rapport du projet</Heading1>
    <EnregistrerAttestationConformitéForm
      identifiantProjet={identifiantProjet}
      attestationConformité={attestationConformité}
    />
  </>
);
