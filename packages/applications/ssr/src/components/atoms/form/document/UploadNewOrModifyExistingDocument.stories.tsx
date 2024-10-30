import type { Meta, StoryObj } from '@storybook/react';

import {
  UploadNewOrModifyExistingDocument,
  UploadNewOrModifyExistingDocumentProps,
} from './UploadNewOrModifyExistingDocument';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Form/Document/UploadNewOrModifyExistingDocument',
  component: UploadNewOrModifyExistingDocument,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<UploadNewOrModifyExistingDocumentProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithDocumentKeysEmpty: Story = {
  args: {
    name: 'test_1',
    label: 'With documents keys empty',
    formats: ['pdf'],
    stateRelatedMessage: 'This is a state related message',
    hintText: "I'm giving some hint",
    documentKeys: [],
  },
};

export const WithDocumentKeysEmptyAndAnError: Story = {
  args: {
    name: 'test_1',
    label: 'With documents keys empty and an error',
    formats: ['pdf'],
    state: 'error',
    stateRelatedMessage: 'This details the error',
    documentKeys: [],
  },
};

export const WithDocumentKeysUndefined: Story = {
  args: {
    name: 'test_1',
    label: 'With documents keys undefined',
    formats: ['pdf'],
    stateRelatedMessage: 'This is a state related message',
    hintText: "I'm giving some hint",
    documentKeys: [],
  },
};

export const WithOneDocumentKey: Story = {
  args: {
    name: 'test_2',
    label: 'With one document key',
    formats: ['pdf'],
    documentKeys: ['test'],
    stateRelatedMessage: 'This is a wonderful state related message',
  },
};

export const WithOneDocumentKeyAndAnError: Story = {
  args: {
    name: 'test_2',
    label: 'With one document key and an error',
    formats: ['pdf'],
    documentKeys: ['test'],
    state: 'error',
    stateRelatedMessage: 'This is a wonderful state related message',
  },
};

export const WithManyDocumentKeys: Story = {
  args: {
    name: 'test_2',
    label: 'With many document keys',
    formats: ['pdf'],
    documentKeys: ['test'],
    stateRelatedMessage: 'This is a wonderful state related message',
  },
};

export const WithManyDocumentKeysAndAnError: Story = {
  args: {
    name: 'test_2',
    label: 'With many document key and an error',
    formats: ['pdf'],
    documentKeys: ['test'],
    state: 'error',
    stateRelatedMessage: 'This is a wonderful state related message',
  },
};

export const Disabled: Story = {
  args: {
    name: 'test_disabled',
    label: 'UploadDocument disabled',
    formats: ['pdf'],
    documentKeys: ['test'],
    stateRelatedMessage: 'This is a wonderful state related message',
    disabled: true,
  },
};
