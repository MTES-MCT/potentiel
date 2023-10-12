import { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Molecules/Radio',
  component: Radio,
};
export default meta;

type Story = StoryObj<typeof Radio>;

export const Primary: Story = {
  args: {
    children: `Exemple de bouton radio`,
    disabled: false,
  },
};
