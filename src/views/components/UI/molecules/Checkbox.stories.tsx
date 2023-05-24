import React from 'react';
import { Checkbox } from './Checkbox';

export default {
  title: 'Components/Molecules/Checkbox',
  component: Checkbox,
  argTypes: {
    children: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

const Template = (args) => (
  <Checkbox id="bouton-checkbox" name="bouton-checkbox" value="bouton-checkbox" {...args} />
);

export const Default = Template.bind({});

Default.args = {
  children: `Exemple de bouton checkbox`,
  disabled: false,
};
