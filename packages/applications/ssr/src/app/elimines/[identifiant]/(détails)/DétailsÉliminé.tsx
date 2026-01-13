import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { SectionPage } from '@/components/atoms/menu/SectionPage';

import { ÉtapesProjetSection } from './_sections/ÉtapesProjet.section';
import { ChiffresClésSection } from './_sections/ChiffresClés.section';
import { DonnéesCandidatureSection } from './_sections/DonnéesCandidature.section';

export type DétailsÉliminéPageProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const DétailsÉliminéPage: FC<DétailsÉliminéPageProps> = ({ identifiantProjet }) => (
  <SectionPage title="Tableau de bord">
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <ÉtapesProjetSection identifiantProjet={identifiantProjet} />
        <ChiffresClésSection identifiantProjet={identifiantProjet} />
      </div>
      <DonnéesCandidatureSection identifiantProjet={identifiantProjet} />
    </div>
  </SectionPage>
);
