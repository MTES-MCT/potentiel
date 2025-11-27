'use client';

import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';
import { Notice } from '@codegouvfr/react-dsfr/Notice';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime } from '@potentiel-domain/common';

import { Timeline } from '../../../../components/organisms/timeline';
import { Heading2 } from '../../../../components/atoms/headings';
import { ColumnPageTemplate } from '../../../../components/templates/ColumnPage.template';

import { Section } from './(components)/Section';

// Ajouter infos sur le CDC
// Ajouter notice abandon
// Ajouter notice ou highlight
// Abandon et CDC
export const VueDEnsembleSection = () => (
  <ColumnPageTemplate
    heading={<Heading2>Vue d'ensemble</Heading2>}
    leftColumn={{
      children: <VueDEnsembleLeft />,
    }}
    rightColumn={{
      children: <VueDEnsembleRight />,
    }}
  />
);

const VueDEnsembleLeft = () => (
  <div className="flex flex-col gap-4">
    <Section title="Cahier des charges">
      <span>Instruction selon le cahier des charges en vigueur</span>
      <Button priority="tertiary no outline" className="p-0 m-0" size="small">
        Voir le cahier des charges
      </Button>
    </Section>
    <Section title="Les étapes du projet">
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
  </div>
);

const VueDEnsembleRight = () => (
  <div className="flex flex-col gap-2">
    <Notice
      description="Vous ne pouvez pas faire de demande ou de déclaration sur Potentiel car vous avez une
            demande d'abandon en cours pour ce projet. Si celle-ci n'est plus d'actualité, merci de
            l'annuler sur la page de la demande ."
      title="Abandon"
      severity="info"
    />
    <Notice
      description="Faut changer de cahier des charges wesh."
      title="Cahier des charges"
      severity="info"
      link={{
        linkProps: {
          href: '#',
        },
        text: 'Veuillez en changer ici',
      }}
    />
    <Section title="Actions">
      <ButtonsGroup
        buttonsSize="medium"
        buttonsEquisized
        alignment="left"
        inlineLayoutWhen="always"
        className="flex flex-col gap-1"
        buttons={[
          {
            children: 'Modifier le lauréat',
            priority: 'secondary',
            size: 'small',
            onClick: () => window.print(),
          },
          {
            children: 'Imprimer la page',
            priority: 'secondary',
            size: 'small',
            onClick: () => window.print(),
          },
        ]}
      />
    </Section>
  </div>
);
