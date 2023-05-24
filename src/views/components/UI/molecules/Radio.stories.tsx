import React from 'react';
import { Radio } from './Radio';

export default {
  title: 'Components/Molecules/Radio',
  component: Radio,
  argTypes: {
    children: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

const Template = (args) => (
  <>
    <Radio id="bouton-radio-1" name="bouton-radio" value="1" {...args} />
    <Radio id="bouton-radio-2" name="bouton-radio" value="2" {...args}>
      <ul>
        <li>Plus de contenu</li>
        <li>Plus de contenu</li>
        <li>Plus de contenu</li>
      </ul>
    </Radio>
  </>
);

export const Default = Template.bind({});

Default.args = {
  children: `Exemple de bouton radio`,
  disabled: false,
};
