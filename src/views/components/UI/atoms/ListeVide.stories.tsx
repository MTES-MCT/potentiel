import React from 'react';
import { ListeVide } from './ListeVide';

export default {
  title: 'Components/Atoms/ListeVide',
  component: ListeVide,
  argTypes: {
    titre: { control: 'text' },
  },
};

const Template = (args) => <ListeVide {...args} />;

export const Default = Template.bind({});
Default.args = {
  titre: `Exemple de titre pour une liste vide`,
};
