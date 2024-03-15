import type { Meta, StoryObj } from '@storybook/react';

import {
  ProjetADéjàUnDépôtEnCoursPage,
  ProjetADéjàUnDépôtEnCoursProps,
} from './ProjetADéjàUnDépôtEnCours.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Garanties-financières/Dépôt/Soumettre',
  component: ProjetADéjàUnDépôtEnCoursPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ProjetADéjàUnDépôtEnCoursProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProjetADéjàUnDépôtEnCoursExistant: Story = {
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
  },
};
