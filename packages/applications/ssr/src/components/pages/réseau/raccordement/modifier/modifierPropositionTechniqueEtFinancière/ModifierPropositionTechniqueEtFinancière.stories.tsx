import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

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
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
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
