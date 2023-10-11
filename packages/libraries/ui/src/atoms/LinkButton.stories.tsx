import { Meta, StoryObj } from '@storybook/react';
import { LinkButton } from './LinkButton';

const meta: Meta<typeof LinkButton> = {
  title: 'Atoms/LinkButton',
  component: LinkButton,
};
export default meta;

type Story = StoryObj<typeof LinkButton>;

export const Primary: Story = {
  args: {
    children: `Example of a LinkButton`,
    href: '#',
  },
};
