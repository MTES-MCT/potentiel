import { IdentifiantProjet } from '@potentiel-domain/projet';

import { SectionPage } from '../(components)/SectionPage';

import { ProducteurSection } from './(sections)/Producteur.section';
import { ReprésentantLégalSection } from './(sections)/ReprésentantLégal.section';
import { ActionnariatSection } from './(sections)/Actionnariat.section';
import { ContractualisationSection } from './(sections)/Contractualisation.section';
import { CandidatSection } from './(sections)/Candidat.section';
import { NoteInnovationSection } from '../(sections)/NoteInnovation.section';

type Props = {
  identifiantProjet: IdentifiantProjet.RawType;
  isInnovation?: boolean;
};

export const InformationsGénéralesPage = ({ identifiantProjet, isInnovation }: Props) => (
  <SectionPage title="Informations Générales">
    <div className="flex flex-col md:flex-row gap-4 print:block print:space-y-4">
      <div className="flex flex-1 flex-col gap-4 print:block print:space-y-4">
        <CandidatSection identifiantProjet={identifiantProjet} />
        <ReprésentantLégalSection identifiantProjet={identifiantProjet} />
        <ProducteurSection identifiantProjet={identifiantProjet} />
      </div>
      <div className="flex flex-1 flex-col gap-4 print:block print:space-y-4">
        <ContractualisationSection identifiantProjet={identifiantProjet} />
        <ActionnariatSection identifiantProjet={identifiantProjet} />
        <NoteInnovationSection identifiantProjet={identifiantProjet} />
      </div>
    </div>
  </SectionPage>
);
