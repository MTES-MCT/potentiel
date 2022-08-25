import React from 'react'
import { LinkButton } from './LinkButton'

export default {
  title: 'Components/Atoms/LinkButton',
  component: LinkButton,
  argTypes: {
    children: { control: 'text' },
    href: { control: 'text' },
  },
}

const Template = (args) => <LinkButton {...args} />

export const Default = Template.bind({})
Default.args = {
  children: `Exemple de lien avec un design de bouton`,
  href: '#',
}
