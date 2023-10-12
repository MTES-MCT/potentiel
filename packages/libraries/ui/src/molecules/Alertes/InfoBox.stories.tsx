import { Meta, StoryObj } from '@storybook/react';
import { InfoBox } from './InfoBox';

const meta: Meta<typeof InfoBox> = {
  title: 'Molecules/InfoBox',
  component: InfoBox,
};
export default meta;

type Story = StoryObj<typeof InfoBox>;

export const Primary: Story = {
  args: {
    title: `Exemple de titre d'une InfoBox`,
    children: `Exemple de description d'une InfoBox`,
  },
};
