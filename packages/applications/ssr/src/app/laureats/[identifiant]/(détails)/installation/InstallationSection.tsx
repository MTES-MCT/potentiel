'use client';

import Button from '@codegouvfr/react-dsfr/Button';

import { Heading2 } from '@/components/atoms/headings';

import { Section } from '../(components)/Section';
import { ColumnPageTemplate } from '../../../../../components/templates/ColumnPage.template';

// Installation : 3 champs
export const InstallationSection = () => (
  <ColumnPageTemplate
    heading={<Heading2>Installation</Heading2>}
    leftColumn={{
      children: <InstallationLeft />,
    }}
    rightColumn={{
      children: <InstallationRight />,
    }}
  />
);

const InstallationLeft = () => (
  <div className="flex flex-col gap-4">
    <Section title="Typologie du projet">
      <div className="flex flex-col gap-2">
        <div>
          <div>
            <div>Bâtiment neuf</div>
            <div>Éléments sous l'installation : un bâtiment pas neuf</div>
          </div>
        </div>
        <Button priority="tertiary no outline">Modifier</Button>
      </div>
    </Section>
    <Section title="Installateur">
      <div className="m-0">Non renseigné</div>
      <Button priority="tertiary no outline">Modifier</Button>
    </Section>
  </div>
);

const InstallationRight = () => (
  <Section title="Dispositif de stockage">
    <div>
      <div>Installation couplée à un dispositif de stockage</div>
      <div>Puissance du dispositif de stockage : 43 kW</div>
      <div>Capacité du dispositif de stockage :35 kWh</div>
      <Button priority="tertiary no outline">Modifier</Button>
    </div>
  </Section>
);
