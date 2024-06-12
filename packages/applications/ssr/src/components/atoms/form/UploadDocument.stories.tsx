import type { Meta, StoryObj } from '@storybook/react';

import { UploadDocument, UploadDocumentProps } from './UploadDocument';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Form/UploadDocument',
  component: UploadDocument,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<UploadDocumentProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutExistingDocument: Story = {
  args: { name: 'test_1', label: 'Test', stateRelatedMessage: 'This is a state related message' },
};

export const WithExistingDocument: Story = {
  args: {
    name: 'test_2',
    label: 'Test',
    documentKey: 'test',
    stateRelatedMessage: 'This is a wonderful state related message',
  },
};

export const Disabled: Story = {
  args: {
    name: 'test_disabled',
    label: 'UploadDocument disabled',
    documentKey: 'test',
    stateRelatedMessage: 'This is a wonderful state related message',
    disabled: true,
  },
};
