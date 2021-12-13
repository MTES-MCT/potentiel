import React from 'react'
import { Timeline } from './timeline'

export default { title: 'Nouvelle frise' }

const projectEventList = {
  events: [
    {
      type: 'ProjectNotified' as 'ProjectNotified',
      variant: 'admin' as 'admin',
      payload: undefined,
      date: 12,
    },
    {
      type: 'ProjectNotified' as 'ProjectNotified',
      variant: 'admin' as 'admin',
      payload: undefined,
      date: 12,
    },
  ],
}

const dgec = {
  id: '1',
  fullName: 'nom prénom',
  email: 'email',
  role: 'dgec' as 'dgec',
}

const ademe = {
  id: '1',
  fullName: 'nom prénom',
  email: 'email',
  role: 'ademe' as 'ademe',
}

export const timeline = () => <Timeline projectEventList={projectEventList} user={dgec} />
