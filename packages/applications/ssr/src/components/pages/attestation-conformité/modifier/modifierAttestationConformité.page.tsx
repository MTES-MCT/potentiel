import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageAttestationConformité } from '../TitrePageAttestationConformité';
import {
  AttestationConformitéForm,
  type AttestationConformitéFormProps,
} from '../AttestationConformité.form';
import { InfoBoxAttestationConformité } from '../InfoAttestationConformité';

import { modifierAttestationConformitéAction } from './modifierAttestationConformité.action';

export type ModifierAttestationConformitéPageProps = {
  projet: ProjetBannerProps;
  attestationConformitéActuelle: AttestationConformitéFormProps['donnéesActuelles'];
};

export const ModifierAttestationConformitéPage: FC<ModifierAttestationConformitéPageProps> = ({
  projet,
  attestationConformitéActuelle,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={projet.identifiantProjet} />}>
    <TitrePageAttestationConformité title="Modifier l'attestation de conformité du projet" />
    <InfoBoxAttestationConformité />
    <AttestationConformitéForm
      identifiantProjet={projet.identifiantProjet}
      action={modifierAttestationConformitéAction}
      submitButtonLabel="Modifier"
      donnéesActuelles={attestationConformitéActuelle}
      demanderMainlevée={{ visible: false, canBeDone: false }}
    />
  </PageTemplate>
);
