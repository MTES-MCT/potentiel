import React, { useState } from 'react';
import { Request } from 'express';

import ROUTES from '../../../../routes';
import {
  PrimaryButton,
  Heading3,
  Input,
  Label,
  Link,
  UserIcon,
  Section,
  Dropdown,
  Form,
  ChampsObligatoiresLégende,
} from '../../../components';

import { ProjectDataForProjectPage } from '../../../../modules/project';
import { userIs } from '../../../../modules/users';
import { GetReprésentantLégalForProjectPage } from '../../../../controllers/project/getProjectPage/_utils';
import { Routes } from '@potentiel-applications/routes';

export type ContactProps = {
  identifiantProjet: string;
  project: ProjectDataForProjectPage;
  user: Request['user'];
  représentantLégal: GetReprésentantLégalForProjectPage;
  modificationsNonPermisesParLeCDCActuel: boolean;
};

export const Contact = ({
  identifiantProjet,
  project,
  user,
  représentantLégal,
  modificationsNonPermisesParLeCDCActuel,
}: ContactProps) => (
  <Section title="Contact" icon={<UserIcon />}>
    <div className="mb-3">{project.nomCandidat}</div>
    <div>
      {représentantLégal && (
        <>
          <Heading3 className="mb-1">Représentant légal</Heading3>
          <div>{représentantLégal.nom}</div>

          {représentantLégal.modification && (
            <Link href={représentantLégal.modification.url} aria-label="Modifier" className="mt-1">
              Modifier{' '}
              {représentantLégal.modification.type === 'lauréat'
                ? 'le représentant légal'
                : 'la candidature'}
            </Link>
          )}
          {représentantLégal.demandeDeModification?.peutConsulterLaDemandeExistante && (
            <Link
              href={Routes.ReprésentantLégal.changement.détail(
                identifiantProjet,
                représentantLégal.demandeDeModification.demandéLe,
              )}
              aria-label="Voir la demande de changement en cours"
              className="block"
            >
              Voir la demande de changement en cours
            </Link>
          )}
          {représentantLégal.demandeDeModification?.peutFaireUneDemande &&
            !modificationsNonPermisesParLeCDCActuel && (
              <Link
                href={Routes.ReprésentantLégal.changement.demander(identifiantProjet)}
                aria-label="Demander un changement"
                className="block"
              >
                Faire une demande de changement
              </Link>
            )}
        </>
      )}
      <Heading3 className="mb-1">Adresse email de candidature</Heading3>
      <div>{project.email}</div>
    </div>

    {project.notifiedOn &&
      userIs(['admin', 'dgec-validateur', 'porteur-projet', 'dreal'])(user) && (
        <ListComptesAvecAcces user={user} project={project} />
      )}

    {userIs(['admin', 'dgec-validateur', 'porteur-projet', 'dreal'])(user) && (
      <InvitationForm project={project} />
    )}
  </Section>
);

type ListComptesAvecAccesProps = {
  user: Request['user'];
  project: ProjectDataForProjectPage & { notifiedOn: number };
};
const ListComptesAvecAcces = ({ user, project }: ListComptesAvecAccesProps) => (
  <div>
    <Heading3 className="mt-4 mb-1">Comptes ayant accès à ce projet</Heading3>
    <ul className="my-1">
      {project.users.map(({ id, fullName, email }) => (
        <>
          <li key={'project_user_' + id}>
            {fullName && `${fullName} - `}
            {email}
          </li>
          {id !== user.id && (
            <Link
              href={ROUTES.REVOKE_USER_RIGHTS_TO_PROJECT_ACTION({
                projectId: project.id,
                userId: id,
              })}
              aria-label={`Retirer les droits sur le projet à ${fullName || email}`}
              className="ml-1"
              confirmation={`Êtes-vous sûr de vouloir retirer les droits de ce projet à ${
                fullName || email
              } ?`}
            >
              retirer les droits de {fullName || email}
            </Link>
          )}
        </>
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
      <Form
        action={ROUTES.INVITE_USER_TO_PROJECT_ACTION}
        method="post"
        name="form"
        className="invitationForm"
      >
        <Heading3 className="mb-1 mt-2">Gestion des accès à ce projet</Heading3>
        <ChampsObligatoiresLégende />
        <input type="hidden" name="projectId" id="projectId" value={project.id} />
        <div>
          <Label htmlFor="email">
            Courrier électronique de la personne habilitée à suivre ce projet
          </Label>
          <Input type="email" name="email" id="email" required aria-required="true" />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mx-auto items-center">
          <PrimaryButton className="mt-2 mr-3" type="submit" name="submit" id="submit">
            Accorder les droits sur ce projet
          </PrimaryButton>
          <Link
            onClick={(e) => {
              e.preventDefault();
              showForm(false);
            }}
            className="cursor-pointer"
          >
            Annuler
          </Link>
        </div>
      </Form>
    </Dropdown>
  );
};
