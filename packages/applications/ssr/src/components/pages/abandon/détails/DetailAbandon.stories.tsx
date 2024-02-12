import type { Meta, StoryObj } from '@storybook/react';

import { DetailAbandonPage, DetailAbandonPageProps } from './DetailAbandon.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Abandon/Détail/DetailAbandonPage',
  component: DetailAbandonPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DetailAbandonPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    projet: {
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
    },
    abandon: {
      demande: {
        demandéPar: 'Porteur#1',
        demandéLe: '2022-01-01',
        recandidature: false,
        preuveRecandidatureStatut: 'en-attente',
        raison: "Justification de l'abandon",
      },
    },
    actions: ['annuler'],
    statut: 'demandé',
  },
};
