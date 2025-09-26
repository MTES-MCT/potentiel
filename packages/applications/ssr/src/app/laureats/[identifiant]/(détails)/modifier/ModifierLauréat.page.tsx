import { IdentifiantProjet } from '@potentiel-domain/projet';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

import { ModifierLauréatForm, ModifierLauréatFormProps } from './ModifierLauréat.form';

export type ModifierLauréatPageProps = ModifierLauréatFormProps;

export const ModifierLauréatPage: React.FC<ModifierLauréatPageProps> = ({
  candidature,
  lauréat,
  projet,
  cahierDesCharges,
}) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(projet.identifiantProjet);

  return (
    <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet.formatter()} />}>
      <ModifierLauréatForm
        candidature={candidature}
        lauréat={lauréat}
        projet={projet}
        cahierDesCharges={cahierDesCharges}
      />
    </PageTemplate>
  );
};
