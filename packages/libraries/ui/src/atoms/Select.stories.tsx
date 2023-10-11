import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Primary: Story = {
  args: {
    children: (
      <>
        <option value="Select a value" selected disabled hidden>
          Select a value
        </option>
        <option value="Option 1">Option 1</option>
        <option value="Option 2">Option 2</option>
        <option value="Option 3">Option 3</option>
        <option value="Option 4">Option 4</option>
      </>
    ),
    disabled: false,
    error: '',
  },
};
