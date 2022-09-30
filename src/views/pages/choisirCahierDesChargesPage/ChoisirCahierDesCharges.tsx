import React from 'react'
import {
  PageLayout,
  ChoisirCahierDesChargesFormulaire,
  InfoBox,
  InfoLienGuideUtilisationCDC,
} from '@components'
import { ProjectDataForChoisirCDCPage } from '@modules/project'
import { Request } from 'express'
import { hydrateOnClient } from '../../helpers'

type ChoisirCahierDesChargesProps = {
  request: Request
  projet: ProjectDataForChoisirCDCPage
}

export const ChoisirCahierDesCharges = PageLayout(({ projet }: ChoisirCahierDesChargesProps) => {
  return (
    <div className="panel p-4">
      <h3 className="section--title">Cahier des charges</h3>
      <div className="flex flex-col max-w-2xl mx-auto">
        <InfoBox className="mb-5">
          <InfoLienGuideUtilisationCDC />
        </InfoBox>
        <ChoisirCahierDesChargesFormulaire projet={projet} />
      </div>
    </div>
  )
})

hydrateOnClient(ChoisirCahierDesCharges)
