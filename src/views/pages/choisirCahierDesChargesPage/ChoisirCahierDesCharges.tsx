import React from 'react'
import {
  PageLayout,
  UserDashboard,
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
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

export const ChoisirCahierDesCharges = PageLayout(
  ({ projet, cahiersChargesURLs }: ChoisirCahierDesChargesProps) => {
    return (
      <UserDashboard>
        <div className="panel p-4">
          <h3 className="section--title">Cahier des charges</h3>
          <div className="flex flex-col max-w-2xl mx-auto">
            <InfoBox className="mb-5">
              <InfoLienGuideUtilisationCDC />
            </InfoBox>
            <ChoisirCahierDesChargesFormulaire
              cahiersChargesURLs={cahiersChargesURLs}
              projet={projet}
            />
          </div>
        </div>
      </UserDashboard>
    )
  }
)

hydrateOnClient(ChoisirCahierDesCharges)
