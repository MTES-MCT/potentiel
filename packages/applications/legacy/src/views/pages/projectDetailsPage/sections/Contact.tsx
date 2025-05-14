import React from 'react';
import { Request } from 'express';

import { Heading3, Link, UserIcon, Section } from '../../../components';

import { ProjectDataForProjectPage } from '../../../../modules/project';
import { userIs } from '../../../../modules/users';
import { GetReprésentantLégalForProjectPage } from '../../../../controllers/project/getProjectPage/_utils';
import { Routes } from '@potentiel-applications/routes';
import { GetProducteurForProjectPage } from '../../../../controllers/project/getProjectPage/_utils/getProducteur';
import { InfoProducteur } from './InfoProducteur';
import { GetCandidatureForProjectPage } from '../../../../controllers/project/getProjectPage/_utils/getCandidature';
import { InfoReprésentantLégal } from './InfoReprésentantLégal';
import { Role } from '@potentiel-domain/utilisateur';

export type ContactProps = {
  identifiantProjet: string;
  project: ProjectDataForProjectPage;
  user: Request['user'];
  représentantLégal?: GetReprésentantLégalForProjectPage;
  producteur?: GetProducteurForProjectPage;
  modificationsNonPermisesParLeCDCActuel: boolean;
  candidature: GetCandidatureForProjectPage;
};

export const Contact = ({
  identifiantProjet,
  project,
  user,
  représentantLégal,
  producteur,
  candidature,
  modificationsNonPermisesParLeCDCActuel,
}: ContactProps) => (
  <Section title="Contact" icon={<UserIcon />}>
    {producteur && (
      <InfoProducteur
        producteur={producteur}
        modificationsPermisesParLeCDCActuel={!modificationsNonPermisesParLeCDCActuel}
        role={Role.convertirEnValueType(user.role)}
      />
    )}
    {représentantLégal && (
      <InfoReprésentantLégal
        représentantLégal={représentantLégal}
        modificationsPermisesParLeCDCActuel={!modificationsNonPermisesParLeCDCActuel}
        role={Role.convertirEnValueType(user.role)}
      />
    )}
    <Heading3 className="mb-1">Adresse email de candidature</Heading3>
    <div>{candidature.emailContact}</div>

    {project.notifiedOn &&
      userIs(['admin', 'dgec-validateur', 'porteur-projet', 'dreal'])(user) && (
        <ListComptesAvecAcces user={user} project={project} />
      )}

    {project.notifiedOn &&
      userIs(['admin', 'dgec-validateur', 'porteur-projet', 'dreal'])(user) && (
        <Link href={Routes.Utilisateur.listerPorteurs(identifiantProjet)}>Gérer les accès</Link>
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
        <div key={'project_user_' + id}>
          <li>
            {fullName && `${fullName} - `}
            {email}
          </li>
        </div>
      ))}
      {!project.users.length && <li>Aucun utilisateur n'a accès à ce projet pour le moment.</li>}
    </ul>
  </div>
);
