import type { Meta, StoryObj } from '@storybook/react';

import { CustomErrorPage, CustomErrorProps } from './CustomError.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/CustomErrorPage',
  component: CustomErrorPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<CustomErrorProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    statusCode: '404',
    type: 'NotFoundError',
  },
};
