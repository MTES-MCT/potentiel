import React from 'react'
import { Request } from 'express'
import { Timeline, CalendarIcon } from '@components'
import { userIs } from '@modules/users'
import { ProjectEventListDTO } from '@modules/frise'
import { AttachFile } from '../components/AttachFile'

type EtapesProjetProps = {
  project: { id: string }
  user: Request['user']
  projectEventList: ProjectEventListDTO
  now: number
}

export const EtapesProjet = ({ user, projectEventList, now, project }: EtapesProjetProps) => (
  <div className="panel p-4 mt-0 flex-auto">
    <h3 className="section--title">
      <CalendarIcon className="w-5 h-5 mr-2" />
      Étapes du projet
    </h3>
    <Timeline
      {...{
        projectEventList,
        now,
      }}
    />
    {userIs(['admin', 'dgec-validateur', 'dreal'])(user) && <AttachFile projectId={project.id} />}
  </div>
)
