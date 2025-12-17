import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading2 } from '@/components/atoms/headings';

import { ProducteurSection } from './(sections)/(producteur)/Producteur.section';
import { ReprésentantLégalSection } from './(sections)/(représentant-légal)/ReprésentantLégal.section';
import { ActionnariatSection } from './(sections)/(actionnariat)/Actionnariat.section';
import { ContractualisationSection } from './(sections)/(contractualisation)/Contractualisation.section';
import { CandidatSection } from './(sections)/(candidat)/Candidat.section';

type Props = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const InformationsGénéralesPage = ({ identifiantProjet }: Props) => (
  <ColumnPageTemplate
    heading={<Heading2>Informations Générales</Heading2>}
    leftColumn={{
      children: <InformationsGénéralesLeft identifiantProjet={identifiantProjet} />,
    }}
    rightColumn={{
      children: <InformationsGénéralesRight identifiantProjet={identifiantProjet} />,
    }}
  />
);

const InformationsGénéralesLeft = ({ identifiantProjet }: Props) => (
  <div className="flex flex-col gap-4">
    <CandidatSection identifiantProjet={identifiantProjet} />
    <ReprésentantLégalSection identifiantProjet={identifiantProjet} />
    <ProducteurSection identifiantProjet={identifiantProjet} />
  </div>
);

const InformationsGénéralesRight = ({ identifiantProjet }: Props) => (
  <div className="flex flex-col gap-4">
    <ContractualisationSection identifiantProjet={identifiantProjet} />
    <ActionnariatSection identifiantProjet={identifiantProjet} />
  </div>
);
