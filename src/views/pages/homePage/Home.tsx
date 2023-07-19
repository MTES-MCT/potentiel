import type { Request } from 'express';
import React from 'react';
import routes from '@routes';
import { Header, Footer, ArrowRightWithCircle } from '../../components';
import { hydrateOnClient } from '../../helpers/hydrateOnClient';
import { InscriptionConnexion, Benefices, PropositionDeValeur } from './components';
import { App } from '@views';

type HomeProps = {
  request: Request;
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
              Voir {user.role === 'porteur-projet' ? 'mes' : 'les'} projets
              <ArrowRightWithCircle className="w-5 h-5 ml-2" aria-hidden />
            </div>
          </Header.MenuItem>
        )}
      </Header>

      <main id="contenu" style={{ fontFamily: 'Marianne, arial, sans-serif' }}>
        <PropositionDeValeur />
        <InscriptionConnexion {...{ user }} />
        <Benefices />
      </main>
      <Footer user={user} />
    </App>
  );
};

hydrateOnClient(Home);
