import type { Meta, StoryObj } from '@storybook/react';

import {
  TransmettrePropositionTechniqueEtFinancièrePage,
  TransmettrePropositionTechniqueEtFinancièreProps,
} from './TransmettrePropositionTechniqueEtFinancière.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/Transmettre/TransmettrePropositionTechniqueEtFinancière',
  component: TransmettrePropositionTechniqueEtFinancièrePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<TransmettrePropositionTechniqueEtFinancièreProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    referenceDossierRaccordement: 'dossierRaccordement#1',
    projet: {
      identifiantProjet: 'identifiantProjet#1',
    },
  },
};
