import { PageLayout  } from '@components'
import { Request } from 'express'
import React from 'react'
import { hydrateOnClient } from '../../../helpers'

import ModificationRequestActionTitles from "../../../components/ModificationRequestActionTitles"
import UserDashboard from '../../../components/UserDashboard'

type DemanderDelaiProps = {
  request: Request
}

export const DemanderDelai = PageLayout(({ request }: DemanderDelaiProps) => {
  return (
    <UserDashboard currentPage={'list-requests'}>
        <div className="panel">
      <div className="panel__header" style={{ position: 'relative' }}>
        <h3>
          <ModificationRequestActionTitles action={'delai'} />
        </h3>
        </div>
        </div>
    </UserDashboard>
  )
 })
hydrateOnClient(DemanderDelai)
