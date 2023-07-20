import React from 'react';
import { Container, Footer, Header, UserNavigation } from '@components';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { App } from '@views';

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
      <Header user={user}>{user && <UserNavigation {...{ user, currentPage }} />}</Header>
      <main id="contenu">
        <Container className="py-3 my-8">{children}</Container>
      </main>
      <Footer user={user} />
    </App>
  );
};
