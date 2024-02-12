import type { Meta, StoryObj } from '@storybook/react';

import { FormFeedback, FormFeedbackProps } from './FormFeedback';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Form/FormFeedback',
  component: FormFeedback,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<FormFeedbackProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithSuccess: Story = {
  args: { formState: { status: 'success' } },
};

export const WithUnknownError: Story = {
  args: { formState: { status: 'unknown-error' } },
};

export const WithDomainError: Story = {
  args: { formState: { status: 'domain-error', message: 'This is a domain error' } },
};

export const WithFormError: Story = {
  args: { formState: { status: 'form-error', errors: [] } },
};

export const WithCsvError: Story = {
  args: {
    formState: {
      status: 'csv-error',
      errors: [
        { line: '1', field: 'field-1', message: 'Error message' },
        { line: '1', field: 'field-2', message: 'Error message' },
        { line: '3', field: 'field-4', message: 'Error message' },
      ],
    },
  },
};
