import React from 'react'
import { PageLayout } from '@components'
import { ProjectDataForProjectPage } from '@modules/project'
import { Request } from 'express'

type ChoisirCahierDesChargesProps = {
  request: Request
  projet: ProjectDataForProjectPage
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

export const ChoisirCahierDesCharges = PageLayout((props: ChoisirCahierDesChargesProps) => {
  return <>salut </>
})
