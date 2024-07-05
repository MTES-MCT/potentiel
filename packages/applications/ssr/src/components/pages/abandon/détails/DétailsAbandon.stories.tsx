import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { DétailsAbandonPage, DétailsAbandonPageProps } from './DétailsAbandon.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Abandon/Détails',
  component: DétailsAbandonPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DétailsAbandonPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const identifiantProjet = 'identifiantProjet#1';

export const Demandé: Story = {
  args: {
    identifiantProjet,
    statut: 'demandé',
    abandon: {
      demande: {
        demandéPar: 'Porteur#1',
        demandéLe: new Date('2022-01-01').toISOString() as Iso8601DateTime,
        recandidature: false,
        preuveRecandidatureStatut: 'non-applicable',
        raison: "Justification de l'abandon",
      },
    },
    actions: [],
  },
};

export const Confirmé: Story = {
  args: {
    identifiantProjet,
    statut: 'confirmé',
    abandon: {
      demande: {
        demandéPar: 'Porteur#1',
        demandéLe: new Date('2022-01-01').toISOString() as Iso8601DateTime,
        recandidature: false,
        preuveRecandidatureStatut: 'non-applicable',
        raison: "Justification de l'abandon",
      },
      confirmation: {
        demandéPar: 'Admin#1',
        demandéLe: new Date('2022-02-01').toISOString() as Iso8601DateTime,
        confirméLe: new Date('2022-03-01').toISOString() as Iso8601DateTime,
        confirméPar: 'Porteur#1',
        réponseSignée: 'Réponse signée',
      },
    },
    actions: [],
  },
};

export const Rejeté: Story = {
  args: {
    identifiantProjet,
    statut: 'rejeté',
    abandon: {
      demande: {
        demandéPar: 'Porteur#1',
        demandéLe: new Date('2022-01-01').toISOString() as Iso8601DateTime,
        recandidature: false,
        preuveRecandidatureStatut: 'non-applicable',
        raison: "Justification de l'abandon",
      },
      rejet: {
        rejetéPar: 'Gestionnaire#1',
        rejetéLe: new Date('2022-04-01').toISOString() as Iso8601DateTime,
        réponseSignée: 'Réponse signée',
      },
    },
    actions: [],
  },
};

export const Accordé: Story = {
  args: {
    identifiantProjet,
    statut: 'accordé',
    abandon: {
      demande: {
        demandéPar: 'Porteur#1',
        demandéLe: new Date('2022-01-01').toISOString() as Iso8601DateTime,
        recandidature: false,
        preuveRecandidatureStatut: 'non-applicable',
        raison: "Justification de l'abandon",
      },
      accord: {
        accordéPar: 'Gestionnaire#1',
        accordéLe: new Date('2022-04-01').toISOString() as Iso8601DateTime,
        réponseSignée: 'Réponse signée',
      },
    },
    actions: [],
  },
};

export const AccordéAvecRecandidature: Story = {
  args: {
    identifiantProjet,
    statut: 'accordé',
    abandon: {
      demande: {
        demandéPar: 'Porteur#1',
        demandéLe: new Date('2022-01-01').toISOString() as Iso8601DateTime,
        recandidature: false,
        preuveRecandidatureStatut: 'en-attente',
        raison: "Justification de l'abandon",
      },
      accord: {
        accordéPar: 'Gestionnaire#1',
        accordéLe: new Date('2022-04-01').toISOString() as Iso8601DateTime,
        réponseSignée: 'Réponse signée',
      },
    },
    actions: [],
  },
};

export const AccordéAvecRecandidatureAvecLienPourTransmettre: Story = {
  args: {
    identifiantProjet,
    statut: 'accordé',
    abandon: {
      demande: {
        demandéPar: 'Porteur#1',
        demandéLe: new Date('2022-01-01').toISOString() as Iso8601DateTime,
        recandidature: true,
        lienRecandidature: 'path/to/page/recandidature',
        preuveRecandidatureStatut: 'en-attente',
        raison: "Justification de l'abandon",
      },
      accord: {
        accordéPar: 'Gestionnaire#1',
        accordéLe: new Date('2022-04-01').toISOString() as Iso8601DateTime,
        réponseSignée: 'Réponse signée',
      },
    },
    actions: [],
  },
};
