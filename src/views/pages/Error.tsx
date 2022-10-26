import type { Request } from 'express'
import React from 'react'
import { PageTemplate } from '@components'
import { hydrateOnClient } from '../helpers'

interface Props {
  request: Request
  errorTitle: string
  errorMessage?: string
}

export const Error = ({ errorTitle, errorMessage, request }: Props) => {
  return (
    <PageTemplate user={request.user}>
      <main role="main">
        <section className="section section-grey pt-10">
          <div className="container">
            <h2>{errorTitle}</h2>
            <p>{errorMessage}</p>
          </div>
        </section>
      </main>
    </PageTemplate>
  )
}

hydrateOnClient(Error)
