import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  DownloadLink,
  Heading1,
  Link,
  LinkButton,
  PageTemplate,
  SuccessBox,
  Tile,
} from '@components';
import { afficherDate, hydrateOnClient } from '../../helpers';
import { DossierRaccordementReadModel } from '@potentiel/domain';
import routes from '@routes';

type ListeDossiersRaccordementProps = {
  user: UtilisateurReadModel;
  dossiers: ReadonlyArray<DossierRaccordementReadModel>;
  projetId: string;
  nomProjet: string;
  success?: string;
};

export const ListeDossiersRaccordement = ({
  user,
  dossiers,
  nomProjet,
  projetId,
  success,
}: ListeDossiersRaccordementProps) => {
  return (
    <PageTemplate user={user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Dossiers de raccordement</Heading1>
        </div>
        {success && <SuccessBox>{success}</SuccessBox>}
        <div className="flex justify-between mb-3">
          <p>Pour le projet : {nomProjet}</p>
          <LinkButton href={routes.GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(projetId)}>
            Ajouter
          </LinkButton>
        </div>
        {dossiers.map(
          ({
            référence,
            gestionnaireRéseau,
            dateQualification,
            dateMiseEnService,
            propositionTechniqueEtFinancière,
          }) => (
            <Tile key={référence} className="mb-3 flex flex-row items-center justify-between">
              <ul className="list-none p-0">
                <li>Référence : {référence}</li>
                <li>Gestionnaire de réseau : {gestionnaireRéseau.raisonSociale}</li>
                <li>Date de qualification : {afficherDate(new Date(dateQualification))}</li>
                <li>
                  <DownloadLink href="">Accusé de réception</DownloadLink>
                </li>
                <li>
                  Date de mise en service :{' '}
                  {dateMiseEnService ? (
                    <span>{afficherDate(new Date(dateMiseEnService))}</span>
                  ) : (
                    <span className="italic">Non renseignée</span>
                  )}
                  {['admin', 'dgec-validateur'].includes(user.role) && (
                    <Link
                      href={routes.GET_TRANSMETTRE_DATE_MISE_EN_SERVICE_PAGE(projetId, référence)}
                      className="ml-3"
                    >
                      Transmettre la date de mise en service
                    </Link>
                  )}
                </li>
                <li>
                  Date de signature de la proposition technique et financière :{' '}
                  {propositionTechniqueEtFinancière ? (
                    <span>
                      {afficherDate(new Date(propositionTechniqueEtFinancière.dateSignature))}
                    </span>
                  ) : (
                    <span className="italic">Non renseignée</span>
                  )}
                  {['admin', 'dgec-validateur', 'porteur-projet'].includes(user.role) && (
                    <Link
                      href={routes.GET_TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIERE_PAGE(
                        projetId,
                        référence,
                      )}
                      className="ml-3"
                    >
                      Transmettre la proposition technique et financière
                    </Link>
                  )}
                </li>
              </ul>
            </Tile>
          ),
        )}
      </div>
    </PageTemplate>
  );
};
hydrateOnClient(ListeDossiersRaccordement);
