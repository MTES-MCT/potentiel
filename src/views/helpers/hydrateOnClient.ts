import { hydrate } from 'react-dom'

export const hydrateOnClient = (Component: (props: any) => JSX.Element) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function () {
      const props = (window as any).__INITIAL_PROPS__
      hydrate(Component(props), document.querySelector('#root'))
    })
  }
}
