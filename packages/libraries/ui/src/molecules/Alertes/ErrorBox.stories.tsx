import { Meta, StoryObj } from '@storybook/react';
import { ErrorBox } from './ErrorBox';

const meta: Meta<typeof ErrorBox> = {
  title: 'Molecules/ErrorBox',
  component: ErrorBox,
};
export default meta;

type Story = StoryObj<typeof ErrorBox>;

export const Primary: Story = {
  args: {
    title: `Exemple de titre d'une ErrorBox`,
    children: `Exemple de description d'une ErrorBox`,
  },
};
