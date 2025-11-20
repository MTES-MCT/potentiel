'use client';

import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

import { DateTime } from '@potentiel-domain/common';

import { Heading2 } from '@/components/atoms/headings';
import { ColumnTemplate } from '@/components/templates/Column.templace';

import { Timeline } from '../../../../../components/organisms/timeline';

// Ajouter infos sur le CDC

export const VueEnsembleSection = () => (
  <ColumnTemplate
    heading={<Heading2>Vue d'ensemble</Heading2>}
    leftColumn={{
      children: <VueEnsemble />,
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
const VueEnsemble = () => (
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
