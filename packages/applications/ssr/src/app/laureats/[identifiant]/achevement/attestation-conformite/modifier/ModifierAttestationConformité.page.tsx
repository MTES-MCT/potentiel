import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import {
  ModifierAttestationConformitéForm,
  type ModifierAttestationConformitéFormProps,
} from './ModifierAttestationConformité.form';

export type ModifierAttestationConformitéPageProps = ModifierAttestationConformitéFormProps;

export const ModifierAttestationConformitéPage: FC<ModifierAttestationConformitéPageProps> = ({
  identifiantProjet,
  attestationConformité,
  rapportAssocié,
}) => (
  <>
    <Heading1>Modifier l'attestation de conformité du projet</Heading1>
    <ModifierAttestationConformitéForm
      identifiantProjet={identifiantProjet}
      attestationConformité={attestationConformité}
      rapportAssocié={rapportAssocié}
    />
  </>
);
