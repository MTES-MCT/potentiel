import { Meta, StoryObj } from '@storybook/react';
import { SuccessBox } from './SuccessBox';

const meta: Meta<typeof SuccessBox> = {
  title: 'Molecules/SuccessBox',
  component: SuccessBox,
};
export default meta;

type Story = StoryObj<typeof SuccessBox>;

export const Primary: Story = {
  args: {
    title: `Exemple de titre d'une SuccessBox`,
    children: `Exemple de description d'une SuccessBox`,
  },
};
