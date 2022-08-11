import React from 'react'
import { LinkButton } from './LinkButton'

export default {
  title: 'Components/Atoms/LinkButton',
  component: LinkButton,
  argTypes: {
    primary: { control: 'boolean' },
    children: { control: 'text' },
    disabled: { control: 'boolean' },
    type: { control: 'select', options: ['download', 'none'] },
  },
}

const Template = (args) => <LinkButton {...args} />

export const Default = Template.bind({})
Default.args = {
  primary: true,
  children: `Ceci est un exemple de lien avec un design de bouton`,
  disabled: false,
  type: 'none',
}
