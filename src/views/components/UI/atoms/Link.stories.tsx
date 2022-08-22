import React from 'react'
import { Link } from './Link'

export default {
  title: 'Components/Atoms/Link',
  component: Link,
  argTypes: {
    children: { control: 'text', defaultValue: 'linkStory' },
    disabled: { control: 'boolean' },
    download: { control: 'boolean' },
    target: { control: { type: 'radio' }, options: ['_blank', '_self', '_parent', '_top'] },
    href: { control: 'text' },
  },
}

const Template = (args) => <Link {...args} />

export const Default = Template.bind({})
Default.args = {
  disabled: false,
  download: false,
  children: `Ceci est un exemple de lien`,
  target: '_blank',
  href: '#',
}
