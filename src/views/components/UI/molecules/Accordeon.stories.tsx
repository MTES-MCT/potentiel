import React from 'react';
import { Accordeon } from './Accordeon';

export default {
  title: 'Components/Molecules/Accordeon',
  component: Accordeon,
  argTypes: {
    buttonChildren: { control: 'text' },
    children: { control: 'text' },
  },
};

const Template = (args: Parameters<typeof Accordeon>[0]) => <Accordeon {...args} />;

export const Default = Template.bind({});
Default.args = {
  buttonChildren: `Exemple d'accordéon`,
  children: (
    <>
      <h2>Contenu</h2>
      <p>Exemple de contenu</p>
    </>
  ),
} as Parameters<typeof Accordeon>[0];
