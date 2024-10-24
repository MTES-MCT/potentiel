import type { Meta, StoryObj } from '@storybook/react';

import { UploadMultipleDocuments, UploadMultipleDocumentsProps } from './UploadMultipleDocuments';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Form/UploadMultipleDocuments',
  component: UploadMultipleDocuments,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<UploadMultipleDocumentsProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'test_1',
    label: 'Téléverser des documents',
  },
};
