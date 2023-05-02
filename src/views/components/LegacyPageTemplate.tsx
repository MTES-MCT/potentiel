import React from 'react';
import { Footer, Header, UserNavigation } from '@components';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';

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
    <>
      <Header user={user}>{user && <UserNavigation {...{ user, currentPage }} />}</Header>
      <main
        role="main"
        className="flex flex-col px-2 py-6 xl:pt-12 xl:mx-auto xl:max-w-7xl"
        style={{ fontFamily: 'Marianne, arial, sans-serif' }}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};
