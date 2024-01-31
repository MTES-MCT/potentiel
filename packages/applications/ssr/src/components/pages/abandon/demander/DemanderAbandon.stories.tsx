import type { Meta, StoryObj } from '@storybook/react';

import { DemanderAbandonPage } from './DemanderAbandon.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Abandon/Demander/DemanderAbandonPage',
  component: DemanderAbandonPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof DemanderAbandonPage>;

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
    showRecandidatureCheckBox: true,
  },
};
