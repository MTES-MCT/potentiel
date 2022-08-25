import React from 'react'
import { Button } from './Button'

export default {
  title: 'Components/Atoms/Button',
  component: Button,
  argTypes: {
    children: { control: 'text' },
  },
}

const Template = (args) => <Button {...args} />

export const Default = Template.bind({})

Default.args = {
  children: `Ceci est un exemple de bouton`,
}
