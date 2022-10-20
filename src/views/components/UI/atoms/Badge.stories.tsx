import React from 'react'
import { Badge } from './Badge'

export default {
  title: 'Components/Atoms/Badge',
  component: Badge,
  argTypes: {
    children: { control: 'text' },
    type: ['success', 'error', 'info', 'warning'],
  },
}

const Template = (args) => <Badge {...args} />

export const Default = Template.bind({})

Default.args = {
  children: `Badge`,
  type: 'info',
}
