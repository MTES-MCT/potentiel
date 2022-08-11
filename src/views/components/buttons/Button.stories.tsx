import React from 'react'
import { Button } from './Button'

export default {
  title: 'Components/Atoms/Button',
  component: Button,
  argTypes: {
    primary: { control: 'boolean' },
    children: { control: 'text' },
    disabled: { control: 'boolean' },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
  },
}

const Template = (args) => <Button {...args} />

export const Default = Template.bind({})
Default.args = {
  primary: true,
  children: <>buttonStory</>,
  onClick: () => console.log('button clicked'),
}
