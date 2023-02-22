import React from 'react';
import { ErrorBox } from './ErrorBox';

export default {
  title: 'Components/Molecules/ErrorBox',
  component: ErrorBox,
  argTypes: {
    title: { control: 'text', defaultValue: 'titre' },
    children: { control: 'text', defaultValue: '-' },
  },
};

const Template = (args) => <ErrorBox {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: `Exemple de titre d'une ErrorBox`,
  children: `Exemple de description d'une ErrorBox`,
};
