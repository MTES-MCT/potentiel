import type { Meta, StoryObj } from '@storybook/react';

import { UploadMultiDocument, UploadMultiDocumentProps } from './UploadMultiDocument';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Form/UploadMultiDocument',
  component: UploadMultiDocument,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<UploadMultiDocumentProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SansDocuments: Story = {
  args: {
    name: 'test_1',
    id: 'test_1',
    label: 'Ajouter des fichiers',
    documents: [],
  },
};
