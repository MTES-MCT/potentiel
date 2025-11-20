import Button from '@codegouvfr/react-dsfr/Button';

import { Heading2, Heading4 } from '@/components/atoms/headings';
import { ColumnTemplate } from '@/components/templates/Column.templace';

export const InformationsGénéralesSection = () => (
  <ColumnTemplate
    heading={<Heading2>Informations Générales</Heading2>}
    leftColumn={{
      children: <InformationGénérales />,
    }}
    rightColumn={{
      children: (
        <Button
          priority="secondary"
          // onClick={() => setIsOpen(true)}
          className="block w-1/2 text-center"
        >
          Une fausse action
        </Button>
      ),
    }}
  />
);

// Site de production
// GFs
// Raccordement
// Puissance
// Prix
// Ajouter infos sur le CDC

const InformationGénérales = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Heading4 className="mb-0">Site de Production</Heading4>
      <span>3 rue du beurre</span>
      <span>69008 LYON</span>
      <span>Région Rhônes Alpes</span>
    </div>
    <div>
      <Heading4 className="mb-0">Société mère</Heading4>
      <span>Groupe Bolloré</span>
    </div>
  </div>
);
