import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';

import { ModifierLauréatForm, ModifierLauréatFormProps } from './ModifierLauréat.form';

export type ModifierLauréatPageProps = ModifierLauréatFormProps;

export const ModifierLauréatPage: React.FC<ModifierLauréatPageProps> = ({
  candidature,
  lauréat,
  projet,
  cahierDesCharges,
  peutRegénérerAttestation,
}) => (
  <PageTemplate banner={<ProjetLauréatBanner identifiantProjet={projet.identifiantProjet} />}>
    <ModifierLauréatForm
      candidature={candidature}
      lauréat={lauréat}
      projet={projet}
      cahierDesCharges={cahierDesCharges}
      peutRegénérerAttestation={peutRegénérerAttestation}
    />
  </PageTemplate>
);
