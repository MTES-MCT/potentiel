import { Request } from 'express';
import React from 'react';

import { Heading1, PageListeTemplate } from '../components';
import { hydrateOnClient } from '../helpers';
import { UtilisateurReadModel } from '../../modules/utilisateur/récupérer/UtilisateurReadModel';

type ListeProjetsAbandonnésAvecRecandidatureProps = {
  request: Request;
  projets: [];
};

export const ListeProjetsAbandonnésAvecRecandidature = ({
  request,
  projets,
}: ListeProjetsAbandonnésAvecRecandidatureProps) => {
  const { error, success } = (request.query as any) || {};

  const utilisateur = request.user as UtilisateurReadModel;

  return (
    <PageListeTemplate
      user={utilisateur}
      currentPage={'liste-projets-avec-recandidature'}
      contentHeader={
        <Heading1 className="!text-white whitespace-nowrap">
          Projets abandonnés avec recandidature
          {/* {utilisateur.role === 'porteur-projet' ? 'Mes Projets' : 'Projets'} */}
          {/* {projects.itemCount > 0 && ` (${projects.itemCount})`} */}
        </Heading1>
      }
    >
      <PageListeTemplate.List sideBarOpen={false}>
        <h2>TODO : LISTER ICI</h2>
      </PageListeTemplate.List>
    </PageListeTemplate>
  );
};

hydrateOnClient(ListeProjetsAbandonnésAvecRecandidature);
