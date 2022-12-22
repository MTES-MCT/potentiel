import React from 'react'
import { PaginationPanel } from './PaginationPanel'

export default {
  title: 'Components/Organisms/Pagination',
  component: PaginationPanel,
  argTypes: {
    nombreDePage: { control: 'number', default: 5 },
    pagination: {
      limiteParPage: { control: 'number', default: 25 },
      page: { control: 'number', default: 1 },
    },
  },
}

const Template = (args) => <PaginationPanel {...args} />

export const Default = Template.bind({})
Default.args = {
  nombreDePage: 5,
  pagination: {
    limiteParPage: 25,
    page: 1,
  },
}
