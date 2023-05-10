import React, { useState } from 'react';
import { Request } from 'express';

import ROUTES from '@routes';
import {
  PrimaryButton,
  Heading3,
  Input,
  Label,
  Link,
  UserIcon,
  Section,
  Dropdown,
} from '@components';

import { ProjectDataForProjectPage } from '@modules/project';
import { userIs } from '@modules/users';
import { dataId } from '../../../../helpers/testId';

type ContactProps = {
  project: ProjectDataForProjectPage;
  user: Request['user'];
};

export const Contact = ({ project, user }: ContactProps) => (
  <Section title="Contact" icon={UserIcon}>
    <div className="mb-3">{project.nomCandidat}</div>
    <div>
      <Heading3 className="mb-1">Représentant légal</Heading3>
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
);

type ListComptesAvecAccesProps = {
  user: Request['user'];
  project: ProjectDataForProjectPage & { notifiedOn: number };
};
const ListComptesAvecAcces = ({ user, project }: ListComptesAvecAccesProps) => (
  <div>
    <Heading3 style={{ marginBottom: 5, marginTop: 15 }}>Comptes ayant accès à ce projet</Heading3>
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
              confirmation={`Êtes-vous sur de vouloir retirer les droits à ce projet à ${fullName} ?`}
            >
              retirer
            </Link>
          )}
        </li>
      ))}
      {!project.users.length && <li>Aucun utilisateur n'a accès à ce projet pour le moment.</li>}
    </ul>
  </div>
);

type InvitationFormProps = {
  project: ProjectDataForProjectPage;
};
const InvitationForm = ({ project }: InvitationFormProps) => {
  const [displayForm, showForm] = useState(false);
  return (
    <Dropdown
      design="link"
      text={`Donner accès à un autre utilisateur`}
      isOpen={displayForm}
      changeOpenState={(isOpen) => showForm(isOpen)}
      className="mt-4"
    >
      <form
        action={ROUTES.INVITE_USER_TO_PROJECT_ACTION}
        method="post"
        name="form"
        className="invitationForm"
      >
        <Heading3 className="mb-1 mt-2">Gestion des accès à ce projet</Heading3>
        <input type="hidden" name="projectId" id="projectId" value={project.id} />
        <Label htmlFor="email" required>
          Courrier électronique de la personne habilitée à suivre ce projet
        </Label>
        <Input type="email" name="email" id="email" required />
        <PrimaryButton
          className="mt-2 mr-3"
          type="submit"
          name="submit"
          id="submit"
          {...dataId('submit-button')}
        >
          Accorder les droits sur ce projet
        </PrimaryButton>
        <Link
          onClick={(e) => {
            e.preventDefault();
            showForm(false);
          }}
        >
          Annuler
        </Link>
      </form>
    </Dropdown>
  );
};
