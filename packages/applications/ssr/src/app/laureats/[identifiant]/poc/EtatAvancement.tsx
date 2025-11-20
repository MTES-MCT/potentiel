// ici mettre
// alerte
// les étapes
// GFS / Raccordement ?

import { LauréatDétailsPageProps } from './LauréatDétails.page';
import { Heading1, Heading4 } from '@/components/atoms/headings';
import Button from '@codegouvfr/react-dsfr/Button';
import { ColumnTemplate } from '@/components/templates/Column.templace';

export const EtatAvancementLauréat: React.FC<LauréatDétailsPageProps> = ({
  identifiantProjet,
  lauréat,
  actions,
}) => (
  <ColumnTemplate
    heading={<Heading1>État d'avancement du projet</Heading1>}
    leftColumn={{
      children: <EtatAvancement />,
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

const EtatAvancement = () => (
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
