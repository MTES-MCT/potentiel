import type { Request } from 'express';
import React from 'react';
import routes from '@potentiel/routes';
import { App, Header, Footer, ArrowRightWithCircle } from '@potentiel/ui';
import { hydrateOnClient } from '../../helpers/hydrateOnClient';
import { InscriptionConnexion, Benefices, PropositionDeValeur } from './components';
import { convertirEnUtilisateurLegacyReadModel } from '../../../modules/utilisateur/récupérer/UtilisateurReadModel';

type HomeProps = {
  request: Request;
};

export const Home = (props: HomeProps) => {
  const {
    request: { user },
  } = props;

  return (
    <App>
      <Header user={convertirEnUtilisateurLegacyReadModel(user)}>
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
      <Footer user={convertirEnUtilisateurLegacyReadModel(user)} />
    </App>
  );
};

hydrateOnClient(Home);
