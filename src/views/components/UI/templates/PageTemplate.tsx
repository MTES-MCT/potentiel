import React from 'react';
import { Footer, Header, UserNavigation } from '@components';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';

export const PageTemplate = ({
  user,
  children,
  currentPage,
}: {
  user: UtilisateurReadModel;
  children: React.ReactNode;
  currentPage?: string;
}) => {
  return (
    <>
      <Header user={user}>{user && <UserNavigation {...{ user, currentPage }} />}</Header>
      <main role="main" style={{ fontFamily: 'Marianne, arial, sans-serif' }}>
        {children}
      </main>
      <Footer />
    </>
  );
};
