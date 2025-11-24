'use client';

import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

import { Heading2 } from '@/components/atoms/headings';
import { ColumnTemplate } from '@/components/templates/Column.templace';

import { Section } from '../(components)/Section';

export const ÉvaluationCarboneSection = () => (
  <ColumnTemplate
    heading={<Heading2>Évaluation Carbone</Heading2>}
    leftColumn={{
      children: <ÉvaluationCarbone />,
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
              children: 'Modifier les fournisseurs',
              iconId: 'fr-icon-mail-line',
              priority: 'secondary',
            },
            {
              children: "Modifier l'évaluation carbone",
              iconId: 'fr-icon-mail-line',
              priority: 'secondary',
            },
          ]}
        />
      ),
    }}
  />
);

const ÉvaluationCarbone = () => (
  <div className="flex flex-col gap-4">
    <Section title="Évaluation carbone simplifiée">
      <span>55 kg eq CO2/kWc</span>
    </Section>
    <Section title="Fournisseurs">
      <ul className="flex flex-col gap-2">
        <li key={1}>
          <span>Postes de conversion : Samsung</span>
        </li>
        <li key={2}>
          <span>Autres : Apple</span>
        </li>
      </ul>
    </Section>
  </div>
);
