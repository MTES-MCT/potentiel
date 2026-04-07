import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import {
  ModifierAttestationConformitéForm,
  ModifierAttestationConformitéFormProps,
} from './ModifierAttestationConformité.form';

export type ModifierAttestationConformitéPageProps = ModifierAttestationConformitéFormProps;

export const ModifierAttestationConformitéPage: FC<ModifierAttestationConformitéPageProps> = ({
  identifiantProjet,
}) => (
  <>
    <Heading1>Modifier l'attestation de conformité du projet</Heading1>
    <ModifierAttestationConformitéForm identifiantProjet={identifiantProjet} />
  </>
);
