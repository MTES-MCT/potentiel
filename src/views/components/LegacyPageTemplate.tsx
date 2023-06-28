import React from 'react';
import { Footer, Header, UserNavigation } from '@components';
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
      <main
        role="main"
        id="contenu"
        className="flex flex-col px-2 py-6 xl:pt-12 xl:mx-auto xl:max-w-7xl w-full"
      >
        <div className="border border-solid border-[#c9d3df] rounded-[3px] p-6">{children}</div>
      </main>
      <Footer user={user} />
    </App>
  );
};
