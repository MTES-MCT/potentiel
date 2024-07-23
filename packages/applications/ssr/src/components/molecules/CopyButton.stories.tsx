import type { Meta, StoryObj } from '@storybook/react';

import { CopyButton, CopyButtonProps } from './CopyButton';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Molecules/CopyButton',
  component: CopyButton,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<CopyButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    textToCopy: 'un texte sympa à copier',
  },
};
