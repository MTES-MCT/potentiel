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

export const timeline = () => <Timeline projectEventList={projectEventList} />
