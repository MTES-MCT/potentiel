import React from 'react';
import { App, Container, Footer, Header, UserNavigation } from '@potentiel/ui';
import { UtilisateurReadModel , convertirEnUtilisateurLegacyReadModel } from '../../modules/utilisateur/récupérer/UtilisateurReadModel';

export const LegacyPageTemplate = ({
  user,
  children,
  currentPage,
}: {
  user: UtilisateurReadModel;
  children: React.ReactNode;
  currentPage?: string;
}) => {
  return (
    <App>
      <Header user={convertirEnUtilisateurLegacyReadModel(user)}>
        {user && (
          <UserNavigation
            user={convertirEnUtilisateurLegacyReadModel(user)}
            currentPage={currentPage}
          />
        )}
      </Header>
      <main id="contenu">
        <Container className="py-3 my-4 lg:my-8">{children}</Container>
      </main>
      <Footer user={convertirEnUtilisateurLegacyReadModel(user)} />
    </App>
  );
};
