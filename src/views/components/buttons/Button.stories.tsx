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
  disabled: false,
  type: 'button',
  children: `Ceci est un exemple de bouton`,
  name: 'nom du bouton',
  value: 'valeur du bouton',
  onClick: () => console.log('button clicked'),
}
