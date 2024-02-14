import type { Meta, StoryObj } from '@storybook/react';

import { Spinner, SpinnerProps } from './Spinner';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Spinner',
  component: Spinner,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['small', 'medium', 'large'],
      control: {
        type: 'radio',
      },
    },
  },
} satisfies Meta<SpinnerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'small',
  },
};
