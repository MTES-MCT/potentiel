import React from 'react'
import { DownloadLink } from './DownloadLink'

export default {
  title: 'Components/Molecules/DownloadLink',
  component: DownloadLink,
  argTypes: {
    children: { control: 'text', defaultValue: 'linkStory' },
    fileUrl: { control: 'text' },
  },
}

const Template = (args) => <DownloadLink {...args} />

export const Default = Template.bind({})
Default.args = {
  children: `Ceci est un exemple de lien de téléchargement`,
  fileUrl: '#',
}
