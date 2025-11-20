'use client';

import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

import { Heading1, Heading4 } from '@/components/atoms/headings';
import { ColumnTemplate } from '@/components/templates/Column.templace';

export const InstallationLauréat = () => (
  <ColumnTemplate
    heading={<Heading1>Installation</Heading1>}
    leftColumn={{
      children: <InfoInstallation />,
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

const InfoInstallation = () => (
  <div className="flex flex-col gap-4">
    <div>
      <Heading4 className="m-0">Typologie du projet</Heading4>
      <div>
        <div>Bâtiment neuf</div>
        <div>Éléments sous l'installation : un bâtiment pas neuf</div>
      </div>
    </div>
    <div>
      <Heading4 className="mb-0">Installateur</Heading4>
      <div className="m-0">Non renseigné</div>
    </div>
    <div>
      <Heading4 className="mb-0">Dispositif de stockage</Heading4>
      <div>Installation couplée à un dispositif de stockage</div>
      <div>Puissance du dispositif de stockage : 43 kW</div>
      <div>Capacité du dispositif de stockage :35 kWh</div>
    </div>
  </div>
);
