import React from 'react'
import { Link } from './Link'

export default {
  title: 'Components/Atoms/Link',
  component: Link,
  argTypes: {
    children: { control: 'text', defaultValue: 'linkStory' },
    href: { control: 'text' },
  },
}

const Template = (args) => <Link {...args} />

export const Default = Template.bind({})
Default.args = {
  children: `Ceci est un exemple de lien`,
  href: '#',
}
