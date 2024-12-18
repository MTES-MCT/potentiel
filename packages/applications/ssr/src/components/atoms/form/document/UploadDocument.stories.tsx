import type { Meta, StoryObj } from '@storybook/react';

import { UploadDocument, UploadDocumentProps } from './UploadDocument';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Form/Document/UploadDocument',
  component: UploadDocument,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<UploadDocumentProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'test_1',
    label: 'Téléverser des documents',
    formats: ['pdf'],
  },
};
