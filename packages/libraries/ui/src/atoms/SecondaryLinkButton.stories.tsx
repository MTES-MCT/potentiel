import { Meta, StoryObj } from '@storybook/react';
import { SecondaryLinkButton } from './SecondaryLinkButton';

const meta: Meta<typeof SecondaryLinkButton> = {
  title: 'Atoms/SecondaryLinkButton',
  component: SecondaryLinkButton,
};
export default meta;

type Story = StoryObj<typeof SecondaryLinkButton>;

export const Primary: Story = {
  args: {
    children: `Example of SecondaryLinkButton`,
    href: '#',
  },
};
