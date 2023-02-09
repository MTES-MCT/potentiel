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
  <section className="m-0 p-4 flex-auto border border-solid border-grey-900-base rounded-[3px]">
    <Heading2 className="border-solid border-x-0 border-t-0 border-b-[1px] border-b-grey-900-base text-2xl">
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
  </section>
)
