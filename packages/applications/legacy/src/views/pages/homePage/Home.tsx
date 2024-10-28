import type { Request } from 'express';
import React from 'react';
import routes from '../../../routes';
import { Header, Footer, ArrowRightWithCircle } from '../../components';
import { hydrateOnClient } from '../../helpers/hydrateOnClient';
import { InscriptionConnexion, Benefices, PropositionDeValeur } from './components';
import { App } from '../..';
import { User } from '../../../entities';

type HomeProps = {
  request: Request;
};

const getMenuText = ({ role }: User) => {
  switch (role) {
    case 'porteur-projet':
      return 'Voir mes projets';
    case 'grd':
      return 'Voir les raccordements';
    default:
      return 'Voir les projets';
  }
};

export const Home = (props: HomeProps) => {
  const {
    request: { user },
  } = props;

  return (
    <App>
      <Header {...{ user }}>
        {user && (
          <Header.MenuItem href={routes.REDIRECT_BASED_ON_ROLE}>
            <div className="flex flex-row items-center">
              {getMenuText(user)}
              <ArrowRightWithCircle className="w-5 h-5 ml-2" aria-hidden />
            </div>
          </Header.MenuItem>
        )}
      </Header>

      <main id="contenu">
        <PropositionDeValeur />
        {user ? (
          <InscriptionConnexion
            connected
            fullName={user.fullName}
            redirectText={getMenuText(user)}
          />
        ) : (
          <InscriptionConnexion connected={false} />
        )}
        <Benefices />
      </main>
      <Footer user={user} />
    </App>
  );
};

hydrateOnClient(Home);
