import React from 'react'
import { Button } from './Button'

export default {
  title: 'Components/Atoms/Button',
  component: Button,
  argTypes: {
    children: { control: 'text' },
    type: { control: { type: 'radio' }, options: ['button', 'submit', 'reset'] },
  },
}

const Template = (args) => <Button {...args} />

export const Default = Template.bind({})

Default.args = {
  type: 'button',
  children: `Ceci est un exemple de bouton`,
  onClick: () => console.log('button clicked'),
}
