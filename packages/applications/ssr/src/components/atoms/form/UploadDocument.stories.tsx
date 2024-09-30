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
  args: {
    name: 'test_1',
    label: 'Without an existing document',
    stateRelatedMessage: 'This is a state related message',
    hintText: "I'm giving some hint",
  },
};

export const WithoutExistingDocumentWithAnError: Story = {
  args: {
    name: 'test_1',
    label: 'Without an existing document with an error',
    state: 'error',
    stateRelatedMessage: 'This details the error',
  },
};

export const WithExistingDocument: Story = {
  args: {
    name: 'test_2',
    label: 'With an existing document',
    documentKey: 'test',
    stateRelatedMessage: 'This is a wonderful state related message',
  },
};

export const WithAnError: Story = {
  args: {
    name: 'test_error',
    label: 'UploadDocument disabled',
    documentKey: 'test',
    state: 'error',
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
