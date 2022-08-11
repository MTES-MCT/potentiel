import React from 'react'
import { LinkButton } from './LinkButton'

export default {
  title: 'Components/Atoms/LinkButton',
  component: LinkButton,
  argTypes: {
    primary: { control: 'boolean' },
    children: { control: 'text' },
    disabled: { control: 'boolean' },
    download: { control: 'boolean' },
    target: { control: 'select', options: ['_blank', '_self', '_parent', '_top'] },
    href: { control: 'text' },
  },
}

const Template = (args) => <LinkButton {...args} />

export const Default = Template.bind({})
Default.args = {
  primary: true,
  children: `Ceci est un exemple de lien avec un design de bouton`,
  disabled: false,
  download: false,
  target: '_self',
  href: '#',
}
