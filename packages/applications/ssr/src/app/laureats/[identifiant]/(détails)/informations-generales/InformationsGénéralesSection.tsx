import Button from '@codegouvfr/react-dsfr/Button';

import { Heading2 } from '@/components/atoms/headings';

import { Section } from '../(components)/Section';
import { ColumnPageTemplate } from '../../../../../components/templates/ColumnPage.template';

// Site de production
// Puissance
// Prix
// Ajouter infos sur le CDC
// puissance
// autorisation d'urbanisme
// GFs
// Raccordement

export const InformationsGénéralesSection = () => (
  <ColumnPageTemplate
    heading={<Heading2>Informations Générales</Heading2>}
    leftColumn={{
      children: <InformationGénéralesLeft />,
    }}
    rightColumn={{
      children: <InformationGénéralesRight />,
    }}
  />
);

const InformationGénéralesLeft = () => (
  <div className="flex flex-col gap-4">
    <Section title="Informations du projet">
      <>
        <div className="flex flex-col">
          <span className="mb-0 font-semibold">Site de Production</span>
          <span>3 rue du beurre</span>
          <span>69008 LYON</span>
          <span>Région Rhônes Alpes</span>
        </div>
        <div>
          <div className="mb-0 font-semibold">Actionnaire</div>
          <span>Groupe Bolloré</span>
        </div>
        <div>
          <div className="mb-0 font-semibold">Prix</div>
          <span>78 €/MWh</span>
        </div>
      </>
    </Section>
    <Section title="Performances">
      <span>Puissance installée : 5 MWc</span>
      <Button priority="tertiary no outline" className="p-0 m-0" size="small">
        Modifier la puissance
      </Button>
    </Section>
    <Section title="Autorisation d'urbanisme">
      <ul className="list-none m-0 pl-0">
        <li>Numéro : PC 084 088 24 A0029</li>
        <li>Date d'obtention : 22/09/2025</li>
      </ul>
    </Section>
    <Section title="Nature de l'exploitation">
      <span>Vente avec injection en totalité</span>
      <Button priority="tertiary no outline" className="p-0 m-0" size="small">
        Modifier la nature de l'exploitation
      </Button>
    </Section>
  </div>
);

const InformationGénéralesRight = () => (
  <div className="flex flex-col gap-4">
    <Section title="Raccordement au réseau">
      <>
        <div className="flex flex-col gap-2">
          <span className="mb-0 font-semibold">Gestionnaire de réseau</span>
          <span>SICAP</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="mb-0 font-semibold">Dossiers de raccordement</span>
          <span>Un dossier renseigné</span>
        </div>
      </>
    </Section>
    <Section title="Garanties financières">
      <>
        <span>
          Le projet dispose actuellement de garanties financières validées, avec une durée de
          validité jusqu'à six mois après achèvement du projet.
        </span>
      </>
    </Section>
  </div>
);
