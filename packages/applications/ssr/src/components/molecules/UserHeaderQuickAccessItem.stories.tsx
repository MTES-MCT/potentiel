import type { Meta, StoryObj } from '@storybook/react';

import { UserHeaderQuickAccessItem } from './UserHeaderQuickAccessItem';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Molecules/User/UserHeaderQuickAccessItem',
  component: UserHeaderQuickAccessItem,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<{}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
