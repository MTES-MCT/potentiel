import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import {
  ModifierAchèvementForm,
  type ModifierAchèvementFormProps,
} from './ModifierAchèvement.form';

export type ModifierAchèvementPageProps = ModifierAchèvementFormProps;

export const ModifierAchèvementPage: FC<ModifierAchèvementPageProps> = ({
  identifiantProjet,
  dateTransmissionAuCocontractant,
  lauréatNotifiéLe,
  attestationConformité,
  rapportAssocié,
  preuveTransmissionAuCocontractant,
}) => (
  <>
    <Heading1>Modifier l'achèvement du projet</Heading1>
    <ModifierAchèvementForm
      identifiantProjet={identifiantProjet}
      lauréatNotifiéLe={lauréatNotifiéLe}
      dateTransmissionAuCocontractant={dateTransmissionAuCocontractant}
      attestationConformité={attestationConformité}
      rapportAssocié={rapportAssocié}
      preuveTransmissionAuCocontractant={preuveTransmissionAuCocontractant}
    />
  </>
);
