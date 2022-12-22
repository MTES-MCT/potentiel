import React from 'react'
import { Pagination } from './Pagination'

export default {
  title: 'Components/Molecules/Pagination',
  component: Pagination,
  argTypes: {
    nombreDePage: { control: 'number', default: 5 },
    page: { control: 'number', default: 1, min: 1 },
  },
}

const Template = (args) => <Pagination {...args} />

export const Default = Template.bind({})
Default.args = {
  nombreDePage: 5,
  page: 1,
}
