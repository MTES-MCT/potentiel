import { IdentifiantProjet } from '@potentiel-domain/projet';

import { SectionPage } from '@/components/atoms/menu/SectionPage';

import { ProducteurSection } from './(sections)/Producteur.section';
import { ReprésentantLégalSection } from './(sections)/ReprésentantLégal.section';
import { CandidatSection } from './(sections)/Documents.section';

type Props = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const DocumentsPage = ({ identifiantProjet }: Props) => (
  <SectionPage title="Documents">
    <div className="flex flex-1 flex-col gap-4 print:block print:space-y-4">
      <CandidatSection identifiantProjet={identifiantProjet} />
      <ReprésentantLégalSection identifiantProjet={identifiantProjet} />
      <ProducteurSection identifiantProjet={identifiantProjet} />
    </div>
  </SectionPage>
);
