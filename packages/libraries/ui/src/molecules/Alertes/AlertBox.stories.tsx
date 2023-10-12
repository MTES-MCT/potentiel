import { Meta, StoryObj } from '@storybook/react';
import { AlertBox } from './AlertBox';

const meta: Meta<typeof AlertBox> = {
  title: 'Molecules/AlertBox',
  component: AlertBox,
};
export default meta;

type Story = StoryObj<typeof AlertBox>;

export const Primary: Story = {
  args: {
    title: `Exemple de titre d'une AlertBox`,
    children: `Exemple de description d'une AlertBox`,
  },
};
