import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { Heading1, Link, PageTemplate, Tile } from '@components';
import { afficherDate, hydrateOnClient } from '../../helpers';
import { DossierRaccordementReadModel } from '@potentiel/domain';
import routes from '@routes';

type ListeDossiersRaccordementProps = {
  user: UtilisateurReadModel;
  dossiers: ReadonlyArray<DossierRaccordementReadModel>;
  projetId: string;
  nomProjet: string;
};

export const ListeDossiersRaccordement = ({
  user,
  dossiers,
  nomProjet,
  projetId,
}: ListeDossiersRaccordementProps) => {
  return (
    <PageTemplate user={user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Dossiers de raccordement</Heading1>
        </div>
        <p>Pour le projet : {nomProjet}</p>
        {dossiers.map(({ référence, gestionnaireRéseau, dateQualification }) => (
          <Tile key={référence} className="mb-3 flex flex-row items-center justify-between">
            <ul className="list-none p-0">
              <li>Référence : {référence}</li>
              <li>Gestionnaire de réseau : {gestionnaireRéseau.raisonSociale}</li>
              <li>Date de qualification : {afficherDate(new Date(dateQualification))}</li>
              <li>
                <Link href={routes.GET_TRANSMETTRE_DATE_MISE_EN_SERVICE_PAGE(projetId)}>
                  Transmettre la date de mise en service
                </Link>
              </li>
              <li>
                <Link>Transmettre la proposition technique et financière</Link>
              </li>
            </ul>
          </Tile>
        ))}
      </div>
    </PageTemplate>
  );
};
hydrateOnClient(ListeDossiersRaccordement);
