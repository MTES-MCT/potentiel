import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import {
  AttestationConformitéForm,
  type AttestationConformitéFormProps,
} from '../AttestationConformité.form';
import { InfoBoxAttestationConformité } from '../InfoAttestationConformité';

import { modifierAttestationConformitéAction } from './modifierAttestationConformité.action';

export type ModifierAttestationConformitéPageProps = Pick<
  AttestationConformitéFormProps,
  | 'identifiantProjet'
  | 'dateTransmissionAuCocontractant'
  | 'attestationConformité'
  | 'preuveTransmissionAuCocontractant'
  | 'lauréatNotifiéLe'
>;

export const ModifierAttestationConformitéPage: FC<ModifierAttestationConformitéPageProps> = ({
  identifiantProjet,
  dateTransmissionAuCocontractant,
  attestationConformité,
  preuveTransmissionAuCocontractant,
  lauréatNotifiéLe,
}) => (
  <>
    <Heading1>Modifier l'attestation de conformité du projet</Heading1>
    <InfoBoxAttestationConformité />
    <AttestationConformitéForm
      identifiantProjet={identifiantProjet}
      action={modifierAttestationConformitéAction}
      submitLabel="Modifier"
      dateTransmissionAuCocontractant={dateTransmissionAuCocontractant}
      attestationConformité={attestationConformité}
      preuveTransmissionAuCocontractant={preuveTransmissionAuCocontractant}
      estUneModification={true}
      demanderMainlevée={{ visible: false, canBeDone: false }}
      lauréatNotifiéLe={lauréatNotifiéLe}
    />
  </>
);
