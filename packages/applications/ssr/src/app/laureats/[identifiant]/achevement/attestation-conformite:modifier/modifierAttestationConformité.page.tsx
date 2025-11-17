import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';

import { TitrePageAttestationConformité } from '../TitrePageAttestationConformité';
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
>;

export const ModifierAttestationConformitéPage: FC<ModifierAttestationConformitéPageProps> = ({
  identifiantProjet,
  dateTransmissionAuCocontractant,
  attestationConformité,
  preuveTransmissionAuCocontractant,
}) => (
  <PageTemplate banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet} />}>
    <TitrePageAttestationConformité title="Modifier l'attestation de conformité du projet" />
    <InfoBoxAttestationConformité />
    <AttestationConformitéForm
      identifiantProjet={identifiantProjet}
      action={modifierAttestationConformitéAction}
      submitLabel="Modifier"
      dateTransmissionAuCocontractant={dateTransmissionAuCocontractant}
      attestationConformité={attestationConformité}
      preuveTransmissionAuCocontractant={preuveTransmissionAuCocontractant}
      demanderMainlevée={{ visible: false, canBeDone: false }}
    />
  </PageTemplate>
);
