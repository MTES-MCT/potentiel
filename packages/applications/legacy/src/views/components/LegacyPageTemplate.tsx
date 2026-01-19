import React from 'react';
import { Container, Footer, Header } from '.';
import { UtilisateurReadModel } from '../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { App } from '..';

export const LegacyPageTemplate = ({
  user,
  children,
}: {
  user?: UtilisateurReadModel;
  children: React.ReactNode;
}) => {
  return (
    <App>
      <Header user={user} />
      <main id="contenu">
        <Container className="py-3 my-4 lg:my-8">{children}</Container>
      </main>
      <Footer user={user} />
    </App>
  );
};
