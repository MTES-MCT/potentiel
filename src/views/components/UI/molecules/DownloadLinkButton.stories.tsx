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
  children: `Exemple de lien de téléchargement`,
  fileUrl: '#',
}
