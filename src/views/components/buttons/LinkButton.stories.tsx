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
    excel: { control: 'boolean' },
    target: { control: { type: 'radio' }, options: ['_blank', '_self', '_parent', '_top'] },
    href: { control: 'text' },
  },
}

const Template = (args) => <LinkButton {...args} />

export const Default = Template.bind({})
Default.args = {
  primary: false,
  disabled: false,
  download: false,
  excel: false,
  children: `Ceci est un exemple de lien avec un design de bouton`,
  target: '_blank',
  href: '#',
}
