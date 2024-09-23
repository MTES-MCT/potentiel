import type { Meta, StoryObj } from '@storybook/react';

import {
  FormFeedbackValidationErrors,
  FormFeedbackValidationProps,
} from './FormFeedbackValidationErrors';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Form/FormFeedbackValidationErrors',
  component: FormFeedbackValidationErrors,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<FormFeedbackValidationProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    errors: ['Error message', 'Error message'],
  },
};
