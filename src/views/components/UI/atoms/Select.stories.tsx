import React from 'react';
import { Select, SelectProps } from './Select';

export default {
  title: 'Components/Atoms/Select',
  component: Select,
};

const Template = (args) => <Select {...args} />;

export const Default = Template.bind({});

const options: SelectProps['options'] = [
  { value: 'Séléctionner une option', default: true },
  { value: 'option 1' },
  { value: 'option 2' },
  { value: 'option 3' },
  { value: 'option 4' },
];

Default.args = {
  options,
};
