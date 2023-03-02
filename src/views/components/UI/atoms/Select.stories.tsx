import React from 'react';
import { Select } from './Select';

export default {
  title: 'Components/Atoms/Select',
  component: Select,
  argTypes: {
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

const Template = (args) => <Select {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: (
    <>
      <option value="Choisir une valeur" selected disabled hidden>
        Choisir une valeur
      </option>
      <option value="Option 1">Option 1</option>
      <option value="Option 2">Option 2</option>
      <option value="Option 3">Option 3</option>
      <option value="Option 4">Option 4</option>
    </>
  ),
  disabled: false,
  error: '',
};
