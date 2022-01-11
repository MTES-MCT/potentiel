import type { Request } from 'express'
import React from 'react'
import Footer from './Footer'
import Header from './Header'

interface HasRequest {
  request: Request
}

export const PageLayout = <T extends HasRequest>(Component: (props: T) => JSX.Element) => (
  props: T
) => {
  return (
    <>
      <Header {...props} />
      <Component {...props} />
      <Footer />
    </>
  )
}
