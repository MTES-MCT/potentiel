import React, { FC, ReactNode } from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  Badge,
  BadgeType,
  Container,
  Heading1,
  KeyIcon,
  Link,
  MapPinIcon,
  PageTemplate,
} from '@components';
import { RésuméProjetReadModel } from '@potentiel/domain';
import routes from '@routes';

export const PageProjetTemplate: FC<{
  user: UtilisateurReadModel;
  résuméProjet: RésuméProjetReadModel;
  titre: ReactNode;
}> = ({ user, résuméProjet, titre, children }) => (
  <PageTemplate user={user}>
    <EntêteProjet {...résuméProjet} />
    <Container className="px-1 md:px-4 py-3 mb-4">
      <Heading1 className="mb-6">{titre}</Heading1>
      {children}
    </Container>
  </PageTemplate>
);

const EntêteProjet: FC<RésuméProjetReadModel> = ({
  identifiantProjet,
  appelOffre,
  période,
  famille,
  numéroCRE,
  statut,
  nom,
  localité,
}) => (
  <section className="bg-blue-france-sun-base text-white py-6 mb-3">
    <Container>
      <div className="w-full py-3 lg:flex justify-between gap-2 px-4">
        <div className="mb-3">
          <div className="flex justify-start items-center">
            <Link
              href={routes.PROJECT_DETAILS(identifiantProjet)}
              className="no-underline text-3xl font-bold text-white"
              style={{ color: 'white', textDecoration: 'none' }}
            >
              {nom}
            </Link>
            <StatutProjet statut={statut} />
          </div>
          <div className="text-xs italic">
            <KeyIcon className="mr-1" />
            {appelOffre}-{période}
            {famille && `-${famille}`}-{numéroCRE}
          </div>
          <p className="text-sm font-medium p-0 m-0 mt-2">
            <MapPinIcon className="mr-1" />
            {localité.commune}, {localité.département}, {localité.région}
          </p>
        </div>
      </div>
    </Container>
  </section>
);

const getBadgeType = (statut: RésuméProjetReadModel['statut']): BadgeType => {
  switch (statut) {
    case 'abandonné':
      return 'warning';
    case 'classé':
      return 'success';
    case 'éliminé':
      return 'error';
    case 'non-notifié':
      return 'info';
  }
};

const StatutProjet: FC<{
  statut: RésuméProjetReadModel['statut'];
}> = ({ statut }) => (
  <Badge type={getBadgeType(statut)} className="ml-2 self-center">
    {statut}
  </Badge>
);
