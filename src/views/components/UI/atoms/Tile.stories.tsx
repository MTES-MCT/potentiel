import React from 'react';
import { Tile } from './Tile';

export default {
  title: 'Components/Atoms/Tile',
  component: Tile,
  argTypes: {
    children: { control: 'text' },
  },
};

const Template = (args) => <Tile {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: `Exemple de tuile`,
};
