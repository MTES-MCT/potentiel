import type { Meta, StoryObj } from '@storybook/react';

import { FormFeedbackProps } from './FormFeedback';
import { FormFeedbackValidationErrors } from './FormFeedbackValidationErrors';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Form/FormFeedbackValidationErrors',
  component: FormFeedbackValidationErrors,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<FormFeedbackProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    formState: {
      status: 'form-error',
      errors: ['Error message', 'Error message'],
    },
  },
};
