import React from 'react'
import { ExternalLink } from './ExternalLink'

export default {
  title: 'Components/Molecules/ExternalLink',
  component: ExternalLink,
  argTypes: {
    children: { control: 'text' },
  },
}

const Template = (args) => <ExternalLink {...args} />

export const Default = Template.bind({})
Default.args = {
  children: `Exemple de lien externe `,
  href: 'https://potentiel.beta.gouv.fr/',
}
