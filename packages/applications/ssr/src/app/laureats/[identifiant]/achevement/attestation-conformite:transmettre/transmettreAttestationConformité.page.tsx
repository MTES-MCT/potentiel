import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageAttestationConformité } from '../TitrePageAttestationConformité';
import { AttestationConformitéForm } from '../AttestationConformité.form';
import { InfoBoxAttestationConformité } from '../InfoAttestationConformité';

import { transmettreAttestationConformitéAction } from './transmettreAttestationConformité.action';

export type TransmettreAttestationConformitéPageProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  peutDemanderMainlevée: boolean;
  peutVoirMainlevée: boolean;
};

export const TransmettreAttestationConformitéPage: FC<
  TransmettreAttestationConformitéPageProps
> = ({ identifiantProjet, peutDemanderMainlevée, peutVoirMainlevée }) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <TitrePageAttestationConformité title="Transmettre l'attestation de conformité du projet" />
    <InfoBoxAttestationConformité />
    <AttestationConformitéForm
      identifiantProjet={identifiantProjet}
      action={transmettreAttestationConformitéAction}
      submitButtonLabel="Transmettre"
      demanderMainlevée={{ visible: peutVoirMainlevée, canBeDone: peutDemanderMainlevée }}
    />
  </PageTemplate>
);
