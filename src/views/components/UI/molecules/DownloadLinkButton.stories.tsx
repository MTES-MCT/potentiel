import React from 'react'
import { DownloadLinkButton } from './DownloadLinkButton'

export default {
  title: 'Components/Molecules/DownloadLinkButton',
  component: DownloadLinkButton,
  argTypes: {
    children: { control: 'text', defaultValue: 'linkStory' },
    fileUrl: { control: 'text' },
  },
}

const Template = (args) => <DownloadLinkButton {...args} />

export const Default = Template.bind({})
Default.args = {
  children: `Ceci est un exemple de lien/bouton de téléchargement`,
  fileUrl: '#',
}
