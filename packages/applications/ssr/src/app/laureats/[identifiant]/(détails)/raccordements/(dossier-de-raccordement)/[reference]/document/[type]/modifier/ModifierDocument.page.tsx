import type { FC } from 'react';

import { SectionPage } from '@/components/atoms/section/SectionPage';
import { ModifierDocumentForm, type ModifierDocumentFormProps } from './ModifierDocument.form';

export type ModifierDocumentPageProps = ModifierDocumentFormProps;

export const ModifierDocumentPage: FC<ModifierDocumentPageProps> = ({
  identifiantProjet,
  raccordement,
}: ModifierDocumentPageProps) => (
  <SectionPage>
    <ModifierDocumentForm identifiantProjet={identifiantProjet} raccordement={raccordement} />
  </SectionPage>
);
