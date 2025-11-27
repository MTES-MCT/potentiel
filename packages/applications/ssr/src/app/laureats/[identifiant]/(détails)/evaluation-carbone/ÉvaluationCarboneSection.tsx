'use client';

import Button from '@codegouvfr/react-dsfr/Button';

import { Heading2 } from '@/components/atoms/headings';

import { Section } from '../(components)/Section';
import { ColumnPageTemplate } from '../../../../../components/templates/ColumnPage.template';

export const ÉvaluationCarboneSection = () => (
  <ColumnPageTemplate
    heading={<Heading2>Évaluation Carbone</Heading2>}
    leftColumn={{
      children: <ÉvaluationCarboneLeft />,
    }}
    rightColumn={{
      children: null,
    }}
  />
);

const ÉvaluationCarboneLeft = () => (
  <div className="flex flex-col gap-4">
    <Section title="Évaluation carbone simplifiée">
      <span>55 kg eq CO2/kWc</span>
      <Button priority="tertiary no outline" className="p-0 m-0" size="small">
        Modifier l'évaluation carbone
      </Button>
    </Section>
    <Section title="Fournisseurs">
      <>
        <ul className="flex flex-col gap-2">
          <li key={1}>
            <span>Postes de conversion : Samsung</span>
          </li>
          <li key={2}>
            <span>Autres : Apple</span>
          </li>
        </ul>
        <Button priority="tertiary no outline" className="p-0 m-0" size="small">
          Modifier les fournisseurs
        </Button>
      </>
    </Section>
  </div>
);
