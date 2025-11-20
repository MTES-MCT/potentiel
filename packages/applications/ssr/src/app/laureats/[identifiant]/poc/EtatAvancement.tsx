'use client';

import { LauréatDétailsPageProps } from './LauréatDétails.page';
import { Heading1 } from '@/components/atoms/headings';
import { ColumnTemplate } from '@/components/templates/Column.templace';
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';
import { Timeline } from '../../../../components/organisms/timeline';
import { DateTime } from '@potentiel-domain/common';

export const EtatAvancementLauréat: React.FC<LauréatDétailsPageProps> = ({
  identifiantProjet,
  lauréat,
  actions,
}) => (
  <ColumnTemplate
    heading={<Heading1>Overview</Heading1>}
    leftColumn={{
      children: <EtatAvancement />,
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
              children: "Télécharger l'attestation",
              priority: 'primary',
              onClick: () => window.print(),
            },
            {
              children: 'Modifier le lauréat',
              priority: 'secondary',
              onClick: () => window.print(),
            },
            {
              children: "Voir l'historique complet",
              priority: 'secondary',
              onClick: () => window.print(),
            },
            {
              children: 'Imprimer la page',
              priority: 'secondary',
              onClick: () => window.print(),
            },
          ]}
        />
      ),
    }}
  />
);

// Etat avance est une timeline filtrées ?
const EtatAvancement = () => (
  <div className="flex flex-col gap-4">
    <Timeline
      items={[
        {
          status: 'info',
          title: 'Notification du projet',
          date: DateTime.now().retirerNombreDeMois(2).formatter(),
        },
        {
          status: 'info',
          title: 'Recours accordé',
          date: DateTime.now().formatter(),
        },
        {
          status: 'info',
          title: "Date d'achèvement prévisionnelle",
          date: DateTime.now().ajouterNombreDeMois(3).formatter(),
        },
      ]}
    />
  </div>
);
