import React from 'react'
import { Link } from './Link'

export default {
  title: 'Components/Atoms/Link',
  component: Link,
  argTypes: {
    children: { control: 'text', defaultValue: 'linkStory' },
    disabled: { control: 'boolean' },
    type: { control: 'select', options: ['download', 'target', 'none'] },
  },
}

const Template = (args) => <Link {...args} />

export const Default = Template.bind({})
Default.args = {
  children: `Ceci est un exemple de lien`,
  disabled: false,
  type: 'none',
}
