'use client';

import Button from '@codegouvfr/react-dsfr/Button';

import { Section } from '../(components)/Section';
import { SectionPage } from '../(components)/SectionPage';

export const ÉvaluationCarboneSection = () => (
  <SectionPage title="Évaluation Carbone">
    <ÉvaluationCarbone />
  </SectionPage>
);

const ÉvaluationCarbone = () => (
  <>
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
  </>
);
