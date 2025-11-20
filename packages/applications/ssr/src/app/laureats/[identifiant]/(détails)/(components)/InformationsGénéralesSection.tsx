import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

import { Heading2 } from '@/components/atoms/headings';
import { ColumnTemplate } from '@/components/templates/Column.templace';

import { Section } from './Section';

// Site de production
// GFs
// Raccordement
// Puissance
// Prix
// Ajouter infos sur le CDC

export const InformationsGénéralesSection = () => (
  <ColumnTemplate
    heading={<Heading2>Informations Générales</Heading2>}
    leftColumn={{
      children: <InformationGénérales />,
    }}
    rightColumn={{
      children: (
        <ButtonsGroup
          buttonsSize="medium"
          buttonsEquisized
          alignment="center"
          inlineLayoutWhen="always"
          className="flex flex-col gap-1"
          buttons={[
            {
              children: 'Modifier les garanties financières',
              iconId: 'fr-icon-mail-line',
              priority: 'secondary',
            },
            {
              children: 'Modifier le site de production',
              iconId: 'fr-icon-mail-line',
              priority: 'secondary',
            },
          ]}
        />
      ),
    }}
  />
);

const InformationGénérales = () => (
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
