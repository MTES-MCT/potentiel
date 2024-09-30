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
  args: { formState: { status: 'success' }, successMessage: 'éléments importés' },
};

export const WithUnknownError: Story = {
  args: { formState: { status: 'unknown-error' }, successMessage: 'éléments importés' },
};

export const WithDomainError: Story = {
  args: {
    formState: { status: 'domain-error', message: 'This is a domain error' },
    successMessage: 'éléments importés',
  },
};

export const WithFormError: Story = {
  args: {
    formState: { status: 'validation-error', errors: {} },
    successMessage: 'éléments importés',
  },
};
