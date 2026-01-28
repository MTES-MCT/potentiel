import { IdentifiantProjet } from '@potentiel-domain/projet';

import { SectionPage } from '@/components/atoms/menu/SectionPage';

import { DocumentsSection } from './(sections)/Documents.section';

type Props = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const DocumentsPage = ({ identifiantProjet }: Props) => (
  <SectionPage title="Documents">
    <div className="flex flex-1 flex-col gap-4 print:block print:space-y-4">
      <DocumentsSection identifiantProjet={identifiantProjet} />
    </div>
  </SectionPage>
);
