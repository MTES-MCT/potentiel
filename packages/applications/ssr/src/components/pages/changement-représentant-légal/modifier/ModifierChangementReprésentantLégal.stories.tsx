import type { Meta, StoryObj } from '@storybook/react';

import {
  ModifierChangementReprésentantLégalPage,
  ModifierChangementReprésentantLégalPageProps,
} from './ModifierChangementReprésentantLégal.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/ChangementReprésentantLégal/Modifier',
  component: ModifierChangementReprésentantLégalPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ModifierChangementReprésentantLégalPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
    typePersonne: 'Personne physique',
    nomRepresentantLegal: 'Nom du représentant légal',
    pièceJustificative: 'pièce-justificative',
  },
};
