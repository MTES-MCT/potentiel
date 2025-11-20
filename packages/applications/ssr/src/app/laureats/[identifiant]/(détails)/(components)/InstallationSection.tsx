'use client';

import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

import { Heading2 } from '@/components/atoms/headings';
import { ColumnTemplate } from '@/components/templates/Column.templace';

import { Section } from './Section';

export const InstallationSection = () => (
  <ColumnTemplate
    heading={<Heading2>Installation et puissance</Heading2>}
    leftColumn={{
      children: <Installation />,
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
              children: 'Modifier la puissance',
              priority: 'secondary',
              onClick: () => window.print(),
            },
            {
              children: 'Modifier le dispositif de stockage',
              priority: 'secondary',
              onClick: () => window.print(),
            },
            {
              children: "Modifier l'installateur",
              priority: 'secondary',
            },
          ]}
        />
      ),
    }}
  />
);

const Installation = () => (
  <div className="flex flex-col gap-4">
    <Section title="Puissance">
      <div>
        <div className="mb-0 font-semibold">Performances</div>
        <span>Puissance installée : 5 MWc</span>
      </div>
    </Section>
    <Section title="Installation">
      <div className="flex flex-col gap-2">
        <div>
          <div className="font-semibold">Typologie du projet</div>
          <div>
            <div>Bâtiment neuf</div>
            <div>Éléments sous l'installation : un bâtiment pas neuf</div>
          </div>
        </div>
        <div>
          <div className="font-semibold">Installateur</div>
          <div className="m-0">Non renseigné</div>
        </div>
        <div>
          <div className="font-semibold">Dispositif de stockage</div>
          <div>Installation couplée à un dispositif de stockage</div>
          <div>Puissance du dispositif de stockage : 43 kW</div>
          <div>Capacité du dispositif de stockage :35 kWh</div>
        </div>
      </div>
    </Section>
  </div>
);
