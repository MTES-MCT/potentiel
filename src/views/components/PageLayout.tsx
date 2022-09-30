import type { Request } from 'express'
import React from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { HeaderForPP } from './UI'

interface HasRequest {
  request: Request
}

export const PageLayout =
  <T extends HasRequest>(Component: (props: T) => JSX.Element) =>
  (props: T) => {
    const {
      request: { user },
    } = props
    return (
      <>
        {user.role === 'porteur-projet' ? (
          <HeaderForPP
            {...{
              user: { ...user, role: 'porteur-projet' },
              currentPage: '',
            }}
          />
        ) : (
          <Header {...{ user: props.request.user }} />
        )}

        {user.role === 'porteur-projet' ? (
          <main
            role="main"
            className="flex flex-col py-6 xl:pt-12 xl:mx-auto xl:max-w-7xl"
            style={{ fontFamily: 'Marianne, arial, sans-serif' }}
          >
            <Component {...props} />
          </main>
        ) : (
          <Component {...props} />
        )}

        <Footer />
      </>
    )
  }
