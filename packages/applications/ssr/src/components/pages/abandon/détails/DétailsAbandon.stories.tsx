import type { Meta, StoryObj } from '@storybook/react';

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

const projet: DétailsAbandonPageProps['projet'] = {
  identifiantProjet: 'identifiantProjet#1',
  appelOffre: 'Appel offre',
  période: 'Période',
  famille: 'Famille',
  nom: 'Nom du projet',
  dateDésignation: '2021-10-23',
  localité: {
    codePostal: 'XXXXX',
    commune: 'Commune',
    département: 'Département',
    région: 'Région',
  },
  statut: 'classé',
};

export const Demandé: Story = {
  args: {
    projet,
    statut: 'demandé',
    abandon: {
      demande: {
        demandéPar: 'Porteur#1',
        demandéLe: '2022-01-01',
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
    projet,
    statut: 'confirmé',
    abandon: {
      demande: {
        demandéPar: 'Porteur#1',
        demandéLe: '2022-01-01',
        recandidature: false,
        preuveRecandidatureStatut: 'non-applicable',
        raison: "Justification de l'abandon",
      },
      confirmation: {
        demandéPar: 'Admin#1',
        demandéLe: '2022-02-01',
        confirméLe: '2022-03-01',
        confirméPar: 'Porteur#1',
        réponseSignée: 'Réponse signée',
      },
    },
    actions: [],
  },
};

export const Rejeté: Story = {
  args: {
    projet,
    statut: 'rejeté',
    abandon: {
      demande: {
        demandéPar: 'Porteur#1',
        demandéLe: '2022-01-01',
        recandidature: false,
        preuveRecandidatureStatut: 'non-applicable',
        raison: "Justification de l'abandon",
      },
      rejet: {
        rejetéPar: 'Gestionnaire#1',
        rejetéLe: '2022-04-01',
        réponseSignée: 'Réponse signée',
      },
    },
    actions: [],
  },
};

export const Accordé: Story = {
  args: {
    projet,
    statut: 'accordé',
    abandon: {
      demande: {
        demandéPar: 'Porteur#1',
        demandéLe: '2022-01-01',
        recandidature: false,
        preuveRecandidatureStatut: 'non-applicable',
        raison: "Justification de l'abandon",
      },
      accord: {
        accordéPar: 'Gestionnaire#1',
        accordéLe: '2022-04-01',
        réponseSignée: 'Réponse signée',
      },
    },
    actions: [],
  },
};

export const AccordéAvecRecandidature: Story = {
  args: {
    projet,
    statut: 'accordé',
    abandon: {
      demande: {
        demandéPar: 'Porteur#1',
        demandéLe: '2022-01-01',
        recandidature: false,
        preuveRecandidatureStatut: 'en-attente',
        raison: "Justification de l'abandon",
      },
      accord: {
        accordéPar: 'Gestionnaire#1',
        accordéLe: '2022-04-01',
        réponseSignée: 'Réponse signée',
      },
    },
    actions: [],
  },
};

export const AccordéAvecRecandidatureAvecLienPourTransmettre: Story = {
  args: {
    projet,
    statut: 'accordé',
    abandon: {
      demande: {
        demandéPar: 'Porteur#1',
        demandéLe: '2022-01-01',
        recandidature: true,
        lienRecandidature: 'path/to/page/recandidature',
        preuveRecandidatureStatut: 'en-attente',
        raison: "Justification de l'abandon",
      },
      accord: {
        accordéPar: 'Gestionnaire#1',
        accordéLe: '2022-04-01',
        réponseSignée: 'Réponse signée',
      },
    },
    actions: [],
  },
};
