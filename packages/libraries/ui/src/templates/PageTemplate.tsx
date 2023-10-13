import React, { ReactNode } from 'react';
import { UtilisateurLegacyReadModel } from '@potentiel/domain-views';

import { App, Container } from '../atoms';
import { Footer, Header, UserNavigation } from '../organisms';

export type PageTemplateProps = {
  user: UtilisateurLegacyReadModel;
  children: React.ReactNode;
  currentPage?: string;
  contentHeader: ReactNode;
};

export const PageTemplate = ({ user, children, currentPage, contentHeader }: PageTemplateProps) => {
  return (
    <App>
      <Header user={user}>{user && <UserNavigation {...{ user, currentPage }} />}</Header>
      <main id="contenu" style={{ fontFamily: 'Marianne, arial, sans-serif' }}>
        <div className="bg-blue-france-sun-base text-white py-6 mb-3">
          <Container>{contentHeader}</Container>
        </div>

        <Container className="py-3 mb-4">{children}</Container>
      </main>
      <Footer user={user} />
    </App>
  );
};
