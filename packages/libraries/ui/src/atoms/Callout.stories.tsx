import { Meta, StoryObj } from '@storybook/react';
import { Callout } from './Callout';

const meta: Meta<typeof Callout> = {
  title: 'Atoms/Callout',
  component: Callout,
};
export default meta;

type Story = StoryObj<typeof Callout>;

export const Primary: Story = {
  args: {
    children: 'Example of Callout',
  },
};
