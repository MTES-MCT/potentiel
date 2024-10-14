import type { Meta, StoryObj } from '@storybook/react';

import {
  TransmettrePropositionTechniqueEtFinancièrePage,
  TransmettrePropositionTechniqueEtFinancièrePageProps,
} from './TransmettrePropositionTechniqueEtFinancière.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/Transmettre/TransmettrePropositionTechniqueEtFinancière',
  component: TransmettrePropositionTechniqueEtFinancièrePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<TransmettrePropositionTechniqueEtFinancièrePageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    referenceDossierRaccordement: 'dossierRaccordement#1',
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
  },
};
