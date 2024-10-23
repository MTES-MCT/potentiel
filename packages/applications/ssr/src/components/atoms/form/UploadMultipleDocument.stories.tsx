import type { Meta, StoryObj } from '@storybook/react';

import { UploadMultipleDocument, UploadMultipleDocumentProps } from './UploadMultipleDocument';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Form/UploadMultipleDocument',
  component: UploadMultipleDocument,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<UploadMultipleDocumentProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'test_1',
    label: 'Téléverser des documents',
  },
};
