import React from 'react';
import { AlertBox } from './AlertBox';

export default {
  title: 'Components/Molecules/AlertBox',
  component: AlertBox,
  argTypes: {
    title: { control: 'text', defaultValue: 'titre' },
    children: { control: 'text', defaultValue: '-' },
  },
};

const Template = (args) => <AlertBox {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: `Exemple de titre d'une AlertBox`,
  children: `Exemple de description d'une AlertBox`,
};
