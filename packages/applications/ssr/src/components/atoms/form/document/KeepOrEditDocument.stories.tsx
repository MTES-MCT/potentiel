import type { Meta, StoryObj } from '@storybook/react';

import { KeepOrEditDocument, KeepOrEditDocumentProps } from './KeepOrEditDocument';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Form/Document/KeepOrEditDocument',
  component: KeepOrEditDocument,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<KeepOrEditDocumentProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'test_1',
    label: 'Téléverser des documents',
    formats: ['pdf'],
    documentKey: 'document_key_1',
  },
};
