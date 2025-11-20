'use client';

import { LauréatDétailsPageProps } from './LauréatDétails.page';
import { Heading1, Heading4 } from '@/components/atoms/headings';
import { ColumnTemplate } from '@/components/templates/Column.templace';
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

export const InstallationLauréat: React.FC<LauréatDétailsPageProps> = ({
  identifiantProjet,
  lauréat,
  actions,
}) => (
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
          buttons={[
            {
              children: 'Modifier le dispositif de stockage',
              priority: 'secondary',
              onClick: () => window.print(),
            },
            {
              children: "Modifier l'installateur",
              priority: 'secondary',
              linkProps: {
                href: Routes.Lauréat.modifier(
                  IdentifiantProjet.bind(identifiantProjet).formatter(),
                ),
              },
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
