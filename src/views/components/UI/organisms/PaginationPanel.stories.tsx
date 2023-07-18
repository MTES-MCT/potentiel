import React from 'react';
import { PaginationPanel } from './PaginationPanel';

export default {
  title: 'Components/Organisms/Pagination',
  component: PaginationPanel,
  argTypes: {
    nombreDePage: { control: 'number', default: 5 },
    limiteParPage: { control: 'number', default: 25 },
    page: { control: 'number', default: 1 },
    titreItems: { control: 'text' },
    currentUrl: { control: 'text' },
  },
};

const Template = (args) => <PaginationPanel {...args} />;

export const Default = Template.bind({});
Default.args = {
  nombreDePage: 5,
  limiteParPage: 25,
  page: 1,
  titreItems: 'Projets',
  currentUrl: 'http://localhost:3000/projets.html',
};
