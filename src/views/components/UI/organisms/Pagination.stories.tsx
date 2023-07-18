import React from 'react';
import { Pagination } from './Pagination';

export default {
  title: 'Components/Organisms/Pagination',
  component: Pagination,
  argTypes: {
    nombreDePage: { control: 'number', default: 5 },
    limiteParPage: { control: 'number', default: 25 },
    page: { control: 'number', default: 1 },
    titreItems: { control: 'text' },
    currentUrl: { control: 'text' },
  },
};

const Template = (args) => <Pagination {...args} />;

export const Default = Template.bind({});
Default.args = {
  nombreDePage: 5,
  limiteParPage: 25,
  page: 1,
  titreItems: 'Projets',
  currentUrl: 'http://localhost:3000/projets.html',
};
