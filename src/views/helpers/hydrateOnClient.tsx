import React from 'react'
import { hydrateRoot } from 'react-dom/client'

export const hydrateOnClient = (Component: (props: any) => JSX.Element) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function () {
      const props = (window as any).__INITIAL_PROPS__
      const container = document.getElementById('root')

      container && hydrateRoot(container, <Component {...props} />)
    })
  }
}
