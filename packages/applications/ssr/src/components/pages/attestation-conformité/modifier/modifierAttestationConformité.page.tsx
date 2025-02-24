import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageAttestationConformité } from '../TitrePageAttestationConformité';
import {
  AttestationConformitéForm,
  type AttestationConformitéFormProps,
} from '../AttestationConformité.form';
import { InfoBoxAttestationConformité } from '../InfoAttestationConformité';

import { modifierAttestationConformitéAction } from './modifierAttestationConformité.action';

export type ModifierAttestationConformitéPageProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  attestationConformitéActuelle: AttestationConformitéFormProps['donnéesActuelles'];
};

export const ModifierAttestationConformitéPage: FC<ModifierAttestationConformitéPageProps> = ({
  identifiantProjet,
  attestationConformitéActuelle,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <TitrePageAttestationConformité title="Modifier l'attestation de conformité du projet" />
    <InfoBoxAttestationConformité />
    <AttestationConformitéForm
      identifiantProjet={identifiantProjet}
      action={modifierAttestationConformitéAction}
      submitButtonLabel="Modifier"
      donnéesActuelles={attestationConformitéActuelle}
      demanderMainlevée={{ visible: false, canBeDone: false }}
    />
  </PageTemplate>
);
