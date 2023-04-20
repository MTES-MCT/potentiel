import React, { FC, ReactNode } from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { Badge, Container, Heading1, PageTemplate } from '@components';
import { RésuméProjetReadModel } from '@potentiel/domain';
import routes from '@routes';

export const PageProjetTemplate: FC<{
  user: UtilisateurReadModel;
  résuméProjet: RésuméProjetReadModel;
  titre: ReactNode;
}> = ({ user, résuméProjet, titre, children }) => (
  <PageTemplate user={user}>
    <EntêteProjet {...résuméProjet} />
    <Container className="px-4 py-3 mb-4">
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
    <Container className="xl:mx-auto xl:max-w-7xl">
      <div className="w-full py-3 lg:flex justify-between gap-2 px-4">
        <div className="mb-3">
          <div className="flex justify-start items-center">
            <a
              href={routes.PROJECT_DETAILS(identifiantProjet)}
              className="no-underline text-3xl font-bold"
              style={{ color: 'white' }}
            >
              {nom}
            </a>
            <StatutProjet statut={statut} />
          </div>
          <p className="text-sm font-medium p-0 m-0">
            {localité.commune}, {localité.département}, {localité.région}
          </p>
          <div className="text-sm">
            {appelOffre}-{période}
            {famille && `-${famille}`}-{numéroCRE}
          </div>
        </div>
      </div>
    </Container>
  </section>
);

const StatutProjet: FC<{
  statut: RésuméProjetReadModel['statut'];
}> = ({ statut }) => {
  switch (statut) {
    case 'abandonné':
      return (
        <Badge type="warning" className="ml-2 self-center">
          Abandonné
        </Badge>
      );
    case 'classé':
      return (
        <Badge type="success" className="ml-2 self-center">
          Classé
        </Badge>
      );
    case 'éliminé':
      return (
        <Badge type="error" className="ml-2 self-center">
          Éliminé
        </Badge>
      );
    case 'non-notifié':
      return (
        <Badge type="info" className="ml-2 self-center">
          Non-notifié
        </Badge>
      );
  }
};
