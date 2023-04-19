import React, { FC } from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { Badge, Container, PageTemplate } from '@components';
import { RésuméProjetReadModel } from '@potentiel/domain';
import routes from '@routes';

export const PageProjet: FC<{
  user: UtilisateurReadModel;
  résuméProjet: RésuméProjetReadModel;
}> = ({ user, résuméProjet, children }) => (
  <PageTemplate user={user}>
    <EntêteProjet {...résuméProjet} />
    {children}
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
  <section className="bg-blue-france-sun-base text-white px-2 md:px-0 py-6 mb-3">
    <Container>
      <div className="w-full py-3 lg:flex justify-between gap-2">
        <div className="mb-3">
          <div className="flex justify-start items-center">
            <h1 className="mb-0 pb-0 text-white">
              <a
                href={routes.PROJECT_DETAILS(identifiantProjet)}
                className="no-underline"
                style={{ color: 'white' }}
              >
                {nom}
              </a>
            </h1>
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
