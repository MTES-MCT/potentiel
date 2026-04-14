import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import { ModifierAchèvementForm, ModifierAchèvementFormProps } from './ModifierAchèvement.form';

export type ModifierAchèvementPageProps = ModifierAchèvementFormProps;

export const ModifierAchèvementPage: FC<ModifierAchèvementPageProps> = ({
  identifiantProjet,
  dateTransmissionAuCocontractant,
  attestationConformité,
  preuveTransmissionAuCocontractant,
  lauréatNotifiéLe,
}) => (
  <>
    <Heading1>Modifier l'achèvement du projet</Heading1>
    <ModifierAchèvementForm
      identifiantProjet={identifiantProjet}
      dateTransmissionAuCocontractant={dateTransmissionAuCocontractant}
      attestationConformité={attestationConformité}
      preuveTransmissionAuCocontractant={preuveTransmissionAuCocontractant}
      lauréatNotifiéLe={lauréatNotifiéLe}
    />
  </>
);
