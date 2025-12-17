import { IdentifiantProjet } from '@potentiel-domain/projet';

import { SectionPage } from '../(components)/SectionPage';

import { ProducteurSection } from './(sections)/(producteur)/Producteur.section';
import { ReprésentantLégalSection } from './(sections)/(représentant-légal)/ReprésentantLégal.section';
import { ActionnariatSection } from './(sections)/(actionnariat)/Actionnariat.section';
import { ContractualisationSection } from './(sections)/(contractualisation)/Contractualisation.section';
import { CandidatSection } from './(sections)/(candidat)/Candidat.section';

type Props = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const InformationsGénéralesPage = ({ identifiantProjet }: Props) => (
  <SectionPage title="Informations Générales">
    <div className="flex flex-col md:flex-row  gap-4">
      <div className="flex flex-1 flex-col gap-4">
        <CandidatSection identifiantProjet={identifiantProjet} />
        <ReprésentantLégalSection identifiantProjet={identifiantProjet} />
        <ProducteurSection identifiantProjet={identifiantProjet} />
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <ContractualisationSection identifiantProjet={identifiantProjet} />
        <ActionnariatSection identifiantProjet={identifiantProjet} />
      </div>
    </div>
  </SectionPage>
);
