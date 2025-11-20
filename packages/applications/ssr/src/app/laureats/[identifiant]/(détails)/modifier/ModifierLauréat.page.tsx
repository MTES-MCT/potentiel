import { ModifierLauréatForm, ModifierLauréatFormProps } from './ModifierLauréat.form';

export type ModifierLauréatPageProps = ModifierLauréatFormProps;

export const ModifierLauréatPage: React.FC<ModifierLauréatPageProps> = ({
  candidature,
  lauréat,
  projet,
  cahierDesCharges,
  peutRegénérerAttestation,
}) => (
  <ModifierLauréatForm
    candidature={candidature}
    lauréat={lauréat}
    projet={projet}
    cahierDesCharges={cahierDesCharges}
    peutRegénérerAttestation={peutRegénérerAttestation}
  />
);
