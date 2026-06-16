import { Heading1 } from '@/components/atoms/headings';
import { ModifierLauréatForm, type ModifierLauréatFormProps } from './ModifierLauréat.form';

export type ModifierLauréatPageProps = ModifierLauréatFormProps;

export const ModifierLauréatPage: React.FC<ModifierLauréatPageProps> = ({
  candidature,
  lauréat,
  projet,
  cahierDesCharges,
  peutRegénérerAttestation,
}) => (
  <>
    <Heading1>Modifier le projet lauréat</Heading1>
    <ModifierLauréatForm
      candidature={candidature}
      lauréat={lauréat}
      projet={projet}
      cahierDesCharges={cahierDesCharges}
      peutRegénérerAttestation={peutRegénérerAttestation}
    />
  </>
);
