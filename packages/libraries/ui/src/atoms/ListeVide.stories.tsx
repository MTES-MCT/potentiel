import { Meta, StoryObj } from '@storybook/react';
import { ListeVide } from './ListeVide';

const meta: Meta<typeof ListeVide> = {
  title: 'Atoms/ListeVide',
  component: ListeVide,
};
export default meta;

type Story = StoryObj<typeof ListeVide>;

export const Primary: Story = {
  args: {
    titre: `Example of ListeVide`,
  },
};
