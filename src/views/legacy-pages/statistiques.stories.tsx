import React from 'react'
import Statistiques from './statistiques'
import makeFakeRequest from '../../__tests__/fixtures/request'

export default { title: 'Statistiques' }

const props = {
  request: makeFakeRequest(),
  mainIframeUrl: '',
  mapIframeUrl: '',
}

export const empty = () => <Statistiques {...props} />
