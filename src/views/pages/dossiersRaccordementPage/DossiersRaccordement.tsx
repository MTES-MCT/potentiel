import React from 'react';
import { Request } from 'express';

import { Heading1, PageTemplate, ProjectProps, Tile } from '@components';
import { hydrateOnClient } from '../../helpers';
import { GestionnaireRéseauReadModel } from '@potentiel/domain';

type DossiersRaccordementProps = {
  request: Request;
  projet: ProjectProps;
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
};

export const DossiersRaccordement = ({
  request,
  projet,
  gestionnairesRéseau: listeGestionnairesRéseau,
}: DossiersRaccordementProps) => {
  const { error, success } = (request.query as any) || {};

  return (
    <PageTemplate user={request.user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Raccordement</Heading1>
          <ul>
            <li>
              <Tile>
                <ul>
                  <li>Demande complète de raccordement</li>
                  <li>Proposition technique et financière</li>
                  <li>Date de mise en service</li>
                </ul>
              </Tile>
            </li>
          </ul>
        </div>
      </div>
    </PageTemplate>
  );
};
hydrateOnClient(DossiersRaccordement);
