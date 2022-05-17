import React from 'react'
import { ProjectActions } from './ProjectActions'
import { ProjectDataForProjectPage } from '@modules/project'
import { User } from '@entities'

export default { title: 'Components/ProjectDetailsPage/ProjectActions' }

const project = { id: 'projectId', isClasse: true } as ProjectDataForProjectPage
const user = { role: 'dreal' } as User

export const ForDreals = () => <ProjectActions {...{ project, user }} />
