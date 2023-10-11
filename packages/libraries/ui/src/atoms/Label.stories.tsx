import { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Primary: Story = {
  args: {
    children: `Example of Label`,
  },
};
