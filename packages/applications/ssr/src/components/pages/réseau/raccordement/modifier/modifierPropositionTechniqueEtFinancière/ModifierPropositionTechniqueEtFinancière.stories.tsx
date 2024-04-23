import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@/utils/formatDate';

import {
  ModifierPropositionTechniqueEtFinancièrePage,
  ModifierPropositionTechniqueEtFinancièrePageProps,
} from './ModifierPropositionTechniqueEtFinancière.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/Modifier/ModifierPropositionTechniqueEtFinancièrePage',
  component: ModifierPropositionTechniqueEtFinancièrePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ModifierPropositionTechniqueEtFinancièrePageProps>;

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
      dateDésignation: new Date('2021-10-23').toISOString() as Iso8601DateTime,
      localité: {
        codePostal: 'XXXXX',
        commune: 'Commune',
        département: 'Département',
        région: 'Région',
      },
      statut: 'classé',
    },
    raccordement: {
      reference: 'référence#1',
      propositionTechniqueEtFinancière: {
        propositionTechniqueEtFinancièreSignée:
          'référence#1/propositionTechniqueEtFinancièreSignée',
        dateSignature: new Date('2024-01-18').toISOString() as Iso8601DateTime,
      },
    },
  },
};
