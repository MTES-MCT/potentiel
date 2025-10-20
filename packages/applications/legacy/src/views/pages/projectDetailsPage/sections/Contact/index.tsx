import React from 'react';
import { Request } from 'express';

import { Heading3, Link, UserIcon, Section } from '../../../../components';

import { ProjectDataForProjectPage } from '../../../../../modules/project';
import { userIs } from '../../../../../modules/users';
import { GetReprésentantLégalForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils';
import { Routes } from '@potentiel-applications/routes';
import { GetProducteurForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getProducteur';
import { InfoProducteur } from './InfoProducteur';
import { InfoReprésentantLégal } from './InfoReprésentantLégal';
import { Role } from '@potentiel-domain/utilisateur';

export type ContactProps = {
  identifiantProjet: string;
  project: ProjectDataForProjectPage;
  user: Request['user'];
  représentantLégal?: GetReprésentantLégalForProjectPage;
  producteur?: GetProducteurForProjectPage;
  modificationsNonPermisesParLeCDCActuel: boolean;
  emailContact: string;
};

export const Contact = ({
  identifiantProjet,
  project,
  user,
  représentantLégal,
  producteur,
  emailContact,
  modificationsNonPermisesParLeCDCActuel,
}: ContactProps) => (
  <Section title="Contact" icon={<UserIcon />} className="flex gap-4 flex-col">
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
    <div>
      <Heading3 className="m-0">Adresse email de candidature</Heading3>
      <div>{emailContact}</div>
    </div>

    {project.notifiedOn &&
      userIs(['admin', 'dgec-validateur', 'porteur-projet', 'dreal'])(user) && (
        <div>
          <Heading3 className="mt-0 mb-1">Comptes ayant accès à ce projet</Heading3>
          <Link href={Routes.Utilisateur.listerPorteurs(identifiantProjet)}>Gérer les accès</Link>
        </div>
      )}
  </Section>
);

type ListeComptesAyantAccèsProps = {
  identifiantProjet: string;
  project: ProjectDataForProjectPage & { notifiedOn: number };
};

const ListeComptesAyantAccès = ({ project, identifiantProjet }: ListeComptesAyantAccèsProps) => (
  <div></div>
);
