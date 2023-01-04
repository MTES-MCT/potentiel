import React from 'react'
import { Request } from 'express'

import ROUTES from '@routes'
import { Button, Input, Label, Link } from '@components'

import { ProjectDataForProjectPage } from '@modules/project'
import { Section } from '../components'
import { userIs } from '@modules/users'
import { dataId } from '../../../../helpers/testId'

type ContactProps = {
  project: ProjectDataForProjectPage
  user: Request['user']
}

export const Contact = ({ project, user }: ContactProps) => (
  <Section title="Contact" icon="user-circle">
    <div style={{ marginBottom: 10 }}>{project.nomCandidat}</div>
    <div>
      <h5 style={{ marginBottom: 5 }}>Représentant légal</h5>
      <div>{project.nomRepresentantLegal}</div>
      <div>{project.email}</div>
    </div>

    {project.notifiedOn &&
      userIs(['admin', 'dgec-validateur', 'porteur-projet', 'dreal'])(user) && (
        <ListComptesAvecAcces {...{ user, project }} />
      )}

    {userIs(['admin', 'dgec-validateur', 'porteur-projet'])(user) && (
      <InvitationForm {...{ project }} />
    )}
  </Section>
)

type ListComptesAvecAccesProps = {
  user: Request['user']
  project: ProjectDataForProjectPage & { notifiedOn: Date }
}
const ListComptesAvecAcces = ({ user, project }: ListComptesAvecAccesProps) => (
  <div>
    <h5 style={{ marginBottom: 5, marginTop: 15 }}>Comptes ayant accès à ce projet</h5>
    <ul style={{ marginTop: 5, marginBottom: 5 }}>
      {project.users.map(({ id, fullName, email }) => (
        <li key={'project_user_' + id}>
          {fullName && `${fullName} - `}
          {email}
          {id !== user.id && (
            <Link
              href={ROUTES.REVOKE_USER_RIGHTS_TO_PROJECT_ACTION({
                projectId: project.id,
                userId: id,
              })}
              style={{ marginLeft: 5 }}
              data-confirm={`Etes-vous sur de vouloir retirer les droits à ce projet à ${fullName} ?`}
            >
              retirer
            </Link>
          )}
        </li>
      ))}
      {!project.users.length && <li>Aucun utilisateur n'a accès à ce projet pour le moment.</li>}
    </ul>
  </div>
)

type InvitationFormProps = {
  project: ProjectDataForProjectPage
}
const InvitationForm = ({ project }: InvitationFormProps) => (
  <div {...dataId('invitation-form')}>
    <Link href="#" {...dataId('invitation-form-show-button')} className="invitationFormToggle">
      Donner accès à un autre utilisateur
    </Link>
    <form
      action={ROUTES.INVITE_USER_TO_PROJECT_ACTION}
      method="post"
      name="form"
      className="invitationForm"
    >
      <h5 style={{ marginBottom: 5 }}>Gestion des accès à ce projet</h5>
      <input type="hidden" name="projectId" id="projectId" value={project.id} />
      <Label htmlFor="email" required>
        Courrier électronique de la personne habilitée à suivre ce projet
      </Label>
      <Input type="email" name="email" id="email" required />
      <Button
        className="mt-2 mr-3"
        type="submit"
        name="submit"
        id="submit"
        {...dataId('submit-button')}
      >
        Accorder les droits sur ce projet
      </Button>
      <Link href="#" {...dataId('invitation-form-hide-button')}>
        Annuler
      </Link>
    </form>
  </div>
)
