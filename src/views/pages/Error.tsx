import type { Request } from 'express'
import React from 'react'
import { PageLayout } from '../components/PageLayout'

interface Props {
  request: Request
  errorTitle: string
  errorMessage?: string
}

/* Pure component */
export const Error = PageLayout(function (props: Props) {
  return (
    <main role="main">
      <section className="section section-grey" style={{ paddingTop: 40 }}>
        <div className="container">
          <h2>{props.errorTitle}</h2>
          {props.errorMessage}
        </div>
      </section>
    </main>
  )
})
