import React from 'react'
import {
  ChoisirCahierDesChargesFormulaire,
  InfoBox,
  InfoLienGuideUtilisationCDC,
  PageTemplate,
} from '@components'
import { ProjectDataForChoisirCDCPage } from '@modules/project'
import { Request } from 'express'
import { hydrateOnClient } from '../../helpers'

type ChoisirCahierDesChargesProps = {
  request: Request
  projet: ProjectDataForChoisirCDCPage
}

export const ChoisirCahierDesCharges = ({ projet, request }: ChoisirCahierDesChargesProps) => {
  return (
    <PageTemplate user={request.user} currentPage="list-projects">
      <div className="panel p-4">
        <h3 className="section--title">Cahier des charges</h3>
        <div className="flex flex-col max-w-2xl mx-auto">
          <InfoBox className="mb-5">
            <InfoLienGuideUtilisationCDC />
          </InfoBox>
          <ChoisirCahierDesChargesFormulaire projet={projet} />
        </div>
      </div>
    </PageTemplate>
  )
}

hydrateOnClient(ChoisirCahierDesCharges)
