import { Meta, StoryObj } from '@storybook/react';
import { BarreDeRecherche } from './BarreDeRecherche';

const meta: Meta<typeof BarreDeRecherche> = {
  title: 'Molecules/BarreDeRecherche',
  component: BarreDeRecherche,
};
export default meta;

type Story = StoryObj<typeof BarreDeRecherche>;

export const Primary: Story = {
  args: {
    placeholder: 'Rechercher',
  },
};
