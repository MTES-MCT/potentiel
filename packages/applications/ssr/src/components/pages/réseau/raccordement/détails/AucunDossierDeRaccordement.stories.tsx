import type { Meta, StoryObj } from '@storybook/react';

import {
  AucunDossierDeRaccordementPage,
  AucunDossierDeRaccordementPageProps,
} from './AucunDossierDeRaccordement.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/Détails/Aucun dossier de raccordement',
  component: AucunDossierDeRaccordementPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<AucunDossierDeRaccordementPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
  },
};
