import { Meta, StoryObj } from '@storybook/react';
import { PrimaryButton } from './PrimaryButton';

const meta: Meta<typeof PrimaryButton> = {
  title: 'Molecules/PrimaryButton',
  component: PrimaryButton,
};
export default meta;

type Story = StoryObj<typeof PrimaryButton>;

export const Primary: Story = {
  args: {
    children: `Exemple de bouton`,
    disabled: false,
  },
};
