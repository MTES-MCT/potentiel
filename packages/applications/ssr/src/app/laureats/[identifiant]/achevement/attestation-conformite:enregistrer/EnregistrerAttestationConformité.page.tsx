import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import {
  EnregistrerAttestationConformitéForm,
  EnregistrerAttestationConformitéFormProps,
} from './EnregistrerAttestationConformité.form';

export type EnregistrerAttestationConformitéPageProps = EnregistrerAttestationConformitéFormProps;

export const EnregistrerAttestationConformitéPage: FC<
  EnregistrerAttestationConformitéPageProps
> = ({ identifiantProjet }) => (
  <>
    <Heading1>Enregistrer l'attestation de conformité du projet</Heading1>
    <EnregistrerAttestationConformitéForm identifiantProjet={identifiantProjet} />
  </>
);
