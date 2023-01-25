import React from 'react'
import { Request } from 'express'
import { Timeline, CalendarIcon, Heading2 } from '@components'
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
    <Heading2 className="section--title text-2xl">
      <CalendarIcon className="w-5 h-5 mr-2" />
      Étapes du projet
    </Heading2>
    <Timeline
      {...{
        projectEventList,
        now,
      }}
    />
    {userIs(['admin', 'dgec-validateur', 'dreal'])(user) && <AttachFile projectId={project.id} />}
  </div>
)
