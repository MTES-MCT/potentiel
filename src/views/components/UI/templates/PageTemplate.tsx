import React, { ReactNode } from 'react';
import { Container, Footer, Header, UserNavigation } from '@components';
import { App } from '@views';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';

type PageTemplateProps = {
  user: UtilisateurReadModel;
  children: React.ReactNode;
  currentPage?: string;
  contentHeader: ReactNode;
};

export const PageTemplate = ({ user, children, currentPage, contentHeader }: PageTemplateProps) => {
  return (
    <App>
      <Header user={user}>{user && <UserNavigation {...{ user, currentPage }} />}</Header>
      <main role="main" id="contenu" style={{ fontFamily: 'Marianne, arial, sans-serif' }}>
        <section className="bg-blue-france-sun-base text-white py-6 mb-3">
          <Container>{contentHeader}</Container>
        </section>

        <Container className="py-3 mb-4">{children}</Container>
      </main>
      <Footer />
    </App>
  );
};
