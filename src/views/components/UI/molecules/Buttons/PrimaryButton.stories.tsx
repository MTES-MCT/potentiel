import React from 'react';
import { PrimaryButton } from './PrimaryButton';

export default {
  title: 'Components/Atoms/Button',
  component: PrimaryButton,
  argTypes: {
    children: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

const Template = (args) => <PrimaryButton {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: `Exemple de bouton`,
  disabled: false,
};
