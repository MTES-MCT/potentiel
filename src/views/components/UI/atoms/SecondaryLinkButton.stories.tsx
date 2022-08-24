import React from 'react'
import { SecondaryLinkButton } from './SecondaryLinkButton'

export default {
  title: 'Components/Atoms/SecondaryLinkButton',
  component: SecondaryLinkButton,
  argTypes: {
    children: { control: 'text' },
    href: { control: 'text' },
  },
}

const Template = (args) => <SecondaryLinkButton {...args} />

export const Default = Template.bind({})
Default.args = {
  children: `Ceci est un exemple de lien avec un design de bouton`,
  href: '#',
}
