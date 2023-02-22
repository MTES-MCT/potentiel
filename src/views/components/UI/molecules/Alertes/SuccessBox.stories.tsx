import React from 'react';
import { SuccessBox } from './SuccessBox';

export default {
  title: 'Components/Molecules/SuccessBox',
  component: SuccessBox,
  argTypes: {
    title: { control: 'text', defaultValue: 'titre' },
    children: { control: 'text', defaultValue: '-' },
  },
};

const Template = (args) => <SuccessBox {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: `Exemple de titre d'une SuccessBox`,
  children: `Exemple de description d'une SuccessBox`,
};
