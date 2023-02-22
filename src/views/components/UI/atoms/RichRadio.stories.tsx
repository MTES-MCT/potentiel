import React from 'react';
import { RichRadio } from './RichRadio';

export default {
  title: 'Components/Atoms/RichRadio',
  component: RichRadio,
  argTypes: {
    children: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

const Template = (args) => (
  <>
    <RichRadio id="bouton-radio-riche-1" name="bouton-radio-riche" value="1" {...args} />
    <RichRadio id="bouton-radio-riche-2" name="bouton-radio-riche" value="2" {...args}>
      <ul>
        <li>Plus de contenu</li>
        <li>Plus de contenu</li>
        <li>Plus de contenu</li>
      </ul>
    </RichRadio>
  </>
);

export const Default = Template.bind({});

Default.args = {
  children: `Exemple de bouton radio riche`,
  disabled: false,
};
