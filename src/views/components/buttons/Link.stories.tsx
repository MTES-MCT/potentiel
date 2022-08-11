import React from 'react'
import { Link } from './Link'

export default {
  title: 'Components/Atoms/Link',
  component: Link,
  argTypes: {
    children: { control: 'text', defaultValue: 'linkStory' },
    disabled: { control: 'boolean' },
    download: { control: 'boolean' },
    target: { control: 'select', options: ['_blank', '_self', '_parent', '_top'] },
    href: { control: 'text' },
  },
}

const Template = (args) => <Link {...args} />

export const Default = Template.bind({})
Default.args = {
  children: `Ceci est un exemple de lien`,
  disabled: false,
  download: false,
  target: '_self',
  href: '#',
}
