import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { Heading1, Link, PageTemplate } from '@components';
import { hydrateOnClient } from '../../helpers';
import routes from '@routes';
import { DossierRaccordementReadModel } from '@potentiel/domain';

type DossierRaccordementProps = {
  user: UtilisateurReadModel;
  dossier: DossierRaccordementReadModel;
  projetId: string;
  nomProjet: string;
};

export const DossierRaccordement = ({
  user,
  projetId,
  dossier,
  nomProjet,
}: DossierRaccordementProps) => {
  const { référence, dateQualification, gestionnaireRéseau } = dossier;
  return (
    <PageTemplate user={user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Dossier de raccordement {référence}</Heading1>
        </div>
        <div>
          <p>Pour le projet : {nomProjet}</p>
          <ul className="list-none p-0">
            <li>Gestionnaire de réseau : {gestionnaireRéseau.raisonSociale}</li>
            <li>Référence : {référence}</li>
            <li>Date de qualification : {dateQualification}</li>
          </ul>
          <Link href={routes.GET_LISTE_DOSSIERS_RACCORDEMENT(projetId)}>Retourner à la liste</Link>
        </div>
      </div>
    </PageTemplate>
  );
};
hydrateOnClient(DossierRaccordement);
