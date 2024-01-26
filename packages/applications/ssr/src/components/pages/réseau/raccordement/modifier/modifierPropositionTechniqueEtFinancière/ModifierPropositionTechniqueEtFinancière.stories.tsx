import type { Meta, StoryObj } from '@storybook/react';

import { ModifierPropositionTechniqueEtFinancièrePage } from './ModifierPropositionTechniqueEtFinancière';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/Modifier/ModifierPropositionTechniqueEtFinancièrePage',
  component: ModifierPropositionTechniqueEtFinancièrePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ModifierPropositionTechniqueEtFinancièrePage>;

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
    raccordement: {
      référence: 'référence#1',
      propositionTechniqueEtFinancière: {
        propositionTechniqueEtFinancièreSignée:
          'référence#1/propositionTechniqueEtFinancièreSignée',
        dateSignature: '2024-01-18',
      },
    },
  },
};
