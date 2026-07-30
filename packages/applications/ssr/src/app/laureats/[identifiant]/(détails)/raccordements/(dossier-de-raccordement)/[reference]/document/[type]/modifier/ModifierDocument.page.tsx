import type { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ModifierDocumentForm, type ModifierDocumentFormProps } from './ModifierDocument.form';

export type ModifierDocumentPageProps = ModifierDocumentFormProps;

export const ModifierDocumentPage: FC<ModifierDocumentPageProps> = ({
  identifiantProjet,
  raccordement,
}: ModifierDocumentPageProps) => {
  return (
    <PageTemplate>
      <ModifierDocumentForm identifiantProjet={identifiantProjet} raccordement={raccordement} />
    </PageTemplate>
  );
};
