import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageAttestationConformité } from '../TitrePageAttestationConformité';
import { AttestationConformitéForm } from '../AttestationConformité.form';
import { InfoBoxAttestationConformitéForm } from '../InfoAttestationConformité';

import { transmettreAttestationConformitéAction } from './transmettreAttestationConformité.action';

export type TransmettreAttestationConformitéPageProps = {
  projet: ProjetBannerProps;
  peutDemanderMainlevée: boolean;
  peutVoirMainlevée: boolean;
};

export const TransmettreAttestationConformitéPage: FC<
  TransmettreAttestationConformitéPageProps
> = ({ projet, peutDemanderMainlevée, peutVoirMainlevée }) => (
  <PageTemplate banner={<ProjetBanner {...projet} />}>
    <TitrePageAttestationConformité title="Transmettre l'attestation de conformité du projet" />
    <InfoBoxAttestationConformitéForm />
    <AttestationConformitéForm
      identifiantProjet={projet.identifiantProjet}
      action={transmettreAttestationConformitéAction}
      submitButtonLabel="Transmettre"
      demanderMainlevée={{ visible: peutVoirMainlevée, canBeDone: peutDemanderMainlevée }}
    />
  </PageTemplate>
);
