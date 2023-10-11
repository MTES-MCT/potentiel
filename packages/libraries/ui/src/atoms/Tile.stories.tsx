import { Meta, StoryObj } from '@storybook/react';
import { Tile } from './Tile';

const meta: Meta<typeof Tile> = {
  title: 'Atoms/Tile',
  component: Tile,
};
export default meta;

type Story = StoryObj<typeof Tile>;

export const Primary: Story = {
  args: {
    children: 'Example of Tile',
  },
};
