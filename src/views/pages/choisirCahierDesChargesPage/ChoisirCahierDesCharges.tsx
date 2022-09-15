import React from 'react'
import {
  PageLayout,
  UserDashboard,
  ExternalLink,
  ChoisirCahierDesChargesFormulaire,
  InfoBox,
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
              <InfoLienVersGuideUtilisation />
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

export const InfoLienVersGuideUtilisation = () => (
  <span>
    Pour plus d'informations sur les modalités d'instruction veuillez consulter cette&nbsp;
    <ExternalLink href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel/comment-faire-une-demande-de-modification-ou-informer-le-prefet-dun-changement">
      page d'aide
    </ExternalLink>
    .
  </span>
)

hydrateOnClient(ChoisirCahierDesCharges)
