import React from 'react';
import { Request } from 'express';

import { Heading3, Link, UserIcon, Section } from '../../../components';

import { ProjectDataForProjectPage } from '../../../../modules/project';
import { userIs } from '../../../../modules/users';
import { GetReprésentantLégalForProjectPage } from '../../../../controllers/project/getProjectPage/_utils';
import { Routes } from '@potentiel-applications/routes';
import { GetProducteurForProjectPage } from '../../../../controllers/project/getProjectPage/_utils/getProducteur';
import { InfoProducteur } from './InfoProducteur';

export type ContactProps = {
  identifiantProjet: string;
  project: ProjectDataForProjectPage;
  user: Request['user'];
  représentantLégal: GetReprésentantLégalForProjectPage;
  producteur?: GetProducteurForProjectPage;
  modificationsNonPermisesParLeCDCActuel: boolean;
};

export const Contact = ({
  identifiantProjet,
  project,
  user,
  représentantLégal,
  producteur,
  modificationsNonPermisesParLeCDCActuel,
}: ContactProps) => (
  <Section title="Contact" icon={<UserIcon />}>
    {producteur && (
      <InfoProducteur
        producteur={producteur}
        modificationsPermisesParLeCDCActuel={!modificationsNonPermisesParLeCDCActuel}
      />
    )}
    <div className="mb-3">{project.nomCandidat}</div>
    <div>
      {représentantLégal && (
        <>
          <Heading3 className="mb-1">Représentant légal</Heading3>
          <div>{représentantLégal.nom}</div>

          {représentantLégal.modification && (
            <Link href={représentantLégal.modification.url} aria-label="Modifier" className="mt-1">
              Modifier {représentantLégal.modification.type === 'lauréat' ? '' : 'la candidature'}
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
