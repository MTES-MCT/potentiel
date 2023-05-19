import React from 'react';
import { RichCheckbox } from './RichCheckbox';

export default {
  title: 'Components/Atoms/RichCheckbox',
  component: RichCheckbox,
  argTypes: {
    children: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

const Template = (args) => (
  <RichCheckbox
    id="bouton-checkbox-riche"
    name="bouton-checkbox-riche"
    value="bouton-checkbox-riche"
    {...args}
  />
);

export const Default = Template.bind({});

Default.args = {
  children: `Exemple de bouton checkbox riche`,
  disabled: false,
};
