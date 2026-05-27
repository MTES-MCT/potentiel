import type { FC } from 'react';

import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { IdentifiantProjetSection } from '@/app/laureats/[identifiant]/(détails)/(sections)/IdentifiantProjet.section';
import { SectionPage } from '@/components/atoms/menu/SectionPage';
import { ChiffresClésSection } from './_sections/ChiffresClés.section';
import { DonnéesCandidatureSection } from './_sections/DonnéesCandidature.section';
import { ÉtapesProjetSection } from './_sections/ÉtapesProjet.section';

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
      <IdentifiantProjetSection identifiantProjet={identifiantProjet} />
    </div>
  </SectionPage>
);
