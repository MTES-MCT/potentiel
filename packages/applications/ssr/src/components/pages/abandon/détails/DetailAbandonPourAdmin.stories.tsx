import type { Meta, StoryObj } from '@storybook/react';

import { DetailAbandonPage, DetailAbandonPageProps } from './DetailAbandon.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Pages/Abandon/Détail/En tant qu'administrateur",
  component: DetailAbandonPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DetailAbandonPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const projet: DetailAbandonPageProps['projet'] = {
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

export const DemanderConfirmation: Story = {
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
      confirmation: {
        demandéPar: 'Admin#1',
        demandéLe: '2022-02-01',
        réponseSignée: 'Réponse signée',
      },
    },
    actions: ['demander-confirmation'],
  },
};

export const InstruireDemande: Story = {
  args: {
    projet,
    abandon: {
      demande: {
        demandéPar: 'Porteur#1',
        demandéLe: '2022-01-01',
        recandidature: false,
        preuveRecandidatureStatut: 'non-applicable',
        raison: "Justification de l'abandon",
      },
    },
    actions: ['accorder-sans-recandidature', 'rejeter'],
    statut: 'demandé',
  },
};

export const InstruireDemandeAvecRecandidature: Story = {
  args: {
    projet,
    abandon: {
      demande: {
        demandéPar: 'Porteur#1',
        demandéLe: '2022-01-01',
        recandidature: true,
        preuveRecandidatureStatut: 'non-applicable',
        raison: "Justification de l'abandon",
      },
    },
    actions: ['accorder-avec-recandidature', 'rejeter'],
    statut: 'demandé',
  },
};
