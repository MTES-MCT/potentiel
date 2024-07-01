'use client';

import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageAttestationConformité } from '../TitrePageAttestationConformité';
import {
  FormulaireAttestationConformité,
  FormulaireAttestationConformitéProps,
} from '../FormulaireAttestationConformité';

import { modifierAttestationConformitéAction } from './modifierAttestationConformité.action';

export type ModifierAttestationConformitéPageProps = {
  projet: ProjetBannerProps;
  attestationConformitéActuelle: FormulaireAttestationConformitéProps['donnéesActuelles'];
};

export const ModifierAttestationConformitéPage: FC<ModifierAttestationConformitéPageProps> = ({
  projet,
  attestationConformitéActuelle,
}) => (
  <PageTemplate banner={<ProjetBanner {...projet} />}>
    <TitrePageAttestationConformité title="Modifier l'attestation de conformité du projet" />

    <FormulaireAttestationConformité
      identifiantProjet={projet.identifiantProjet}
      action={modifierAttestationConformitéAction}
      submitButtonLabel="Modifier"
      donnéesActuelles={attestationConformitéActuelle}
      demanderMainlevée={{ visible: false }}
    />
  </PageTemplate>
);
