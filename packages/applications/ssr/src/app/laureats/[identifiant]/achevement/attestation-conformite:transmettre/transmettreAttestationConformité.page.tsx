import type { FC } from 'react';

import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { AttestationConformitéForm } from '../AttestationConformité.form';
import { InfoBoxAttestationConformité } from '../InfoAttestationConformité';
import { TitrePageAttestationConformité } from '../TitrePageAttestationConformité';
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
