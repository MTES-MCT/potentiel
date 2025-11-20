'use client';

import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { DateTime } from '@potentiel-domain/common';

import { ColumnTemplate } from '@/components/templates/Column.templace';

import { Timeline } from '../../../../../components/organisms/timeline';
import { Heading2 } from '../../../../../components/atoms/headings';

import { Section } from './Section';

// Ajouter infos sur le CDC

export const VueEnsembleSection = () => (
  <ColumnTemplate
    heading={<Heading2>Vue d'ensemble</Heading2>}
    leftColumn={{
      children: <VueEnsemble />,
    }}
    rightColumn={{
      children: (
        <div className="flex flex-col gap-4">
          <ButtonsGroup
            buttonsSize="medium"
            buttonsEquisized
            alignment="center"
            inlineLayoutWhen="always"
            className="flex flex-col gap-1"
            buttons={[
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
        </div>
      ),
    }}
  />
);

const VueEnsemble = () => (
  <div className="flex flex-col gap-4">
    <Section title="Les étapes du projet">
      {/* Est une timeline filtrées ? */}
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
    </Section>
    <Section title="Informations importantes">
      <Alert
        severity="info"
        title="Abandon en cours"
        description={
          <span>
            Vous ne pouvez pas faire de demande ou de déclaration sur Potentiel car vous avez une
            demande d'abandon en cours pour ce projet. Si celle-ci n'est plus d'actualité, merci de
            l'annuler sur la page de la demande .
          </span>
        }
      />
    </Section>
  </div>
);
