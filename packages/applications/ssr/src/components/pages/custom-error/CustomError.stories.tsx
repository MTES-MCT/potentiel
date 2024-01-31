import type { Meta, StoryObj } from '@storybook/react';

import { CustomErrorPage } from './CustomError.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/CustomErrorPage',
  component: CustomErrorPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof CustomErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    statusCode: '404',
    type: 'NotFoundError',
  },
};
