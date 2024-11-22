import type { Meta, StoryObj } from '@storybook/react';

import {
  CorrigerReprésentantLégalPage,
  CorrigerReprésentantLégalPageProps,
} from './ModifierReprésentantLégal.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/ReprésentantLégal/Corriger',
  component: CorrigerReprésentantLégalPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<CorrigerReprésentantLégalPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
    représentantLégalExistant: {
      typePersonne: 'Personne physique',
      nomReprésentantLégal: 'Jean Dupont',
    },
  },
};
