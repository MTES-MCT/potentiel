import type { Meta, StoryObj } from '@storybook/react';

import { FormFeedbackProps } from './FormFeedback';
import { FormFeedbackCsvErrors } from './FormFeedbackCsvErrors';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Form/FormFeedbackCsvErrors',
  component: FormFeedbackCsvErrors,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<FormFeedbackProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
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
