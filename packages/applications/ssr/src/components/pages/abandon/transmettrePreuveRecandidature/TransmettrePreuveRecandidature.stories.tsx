import type { Meta, StoryObj } from '@storybook/react';

import {
  TransmettrePreuveRecandidaturePage,
  TransmettrePreuveRecandidaturePageProps,
} from './TransmettrePreuveRecandidature.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Abandon/Transmettre/TransmettrePreuveRecandidaturePage',
  component: TransmettrePreuveRecandidaturePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<TransmettrePreuveRecandidaturePageProps>;

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
    projetsÀSélectionner: Array.from({ length: 10 }, (_, i) => ({
      identifiantProjet: `identifiantProjet#${i}`,
      appelOffre: `Appel offre ${i}`,
      période: `Période ${i}`,
      famille: `${i % 2 === 0 ? `Famille ${i}` : ''}`,
      numéroCRE: `Numéro CRE ${i}`,
      nom: `Nom du projet ${i}`,
      dateDésignation: '2021-10-23',
    })),
  },
};
