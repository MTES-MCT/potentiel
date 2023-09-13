import React from 'react';
import {
  Badge,
  ClockIcon,
  DownloadLink,
  Heading1,
  Heading2,
  KeyIcon,
  Link,
  ListeVide,
  MapPinIcon,
  PageTemplate,
  Pagination,
  Tile,
} from '../../../components';
import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { ProjetReadModel } from '@potentiel/domain-views';
import routes from '../../../../routes';
import { afficherDate, hydrateOnClient } from '../../../helpers';

type ListeDépôtsGarantiesFinancièresEnAttenteProps = {
  user: UtilisateurReadModel;
  projets?: ReadonlyArray<{
    dateLimiteDépôt?: string;
    projet: Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire' | 'statut'>;
  }>;
  pagination: { currentPage: number; pageCount: number; currentUrl: string };
};

export const ListeDépôtsGarantiesFinancièresEnAttente = ({
  user,
  projets,
  pagination: { currentPage, pageCount, currentUrl },
}: ListeDépôtsGarantiesFinancièresEnAttenteProps) => {
  const isLate = (dateLimiteDépôt?: string) =>
    dateLimiteDépôt && new Date(dateLimiteDépôt).getTime() < new Date().getTime();

  return (
    <PageTemplate
      currentPage="liste-depots-garanties-financieres-en-attente"
      user={user}
      contentHeader={<Heading1 className="text-white">Garanties financières</Heading1>}
    >
      <Heading2>Projets en attente de dépôt de garanties financières</Heading2>
      {!projets || !projets.length ? (
        <ListeVide titre="Aucun projet à afficher" />
      ) : (
        <div>
          <ul className="p-0 m-0">
            {projets.map(
              ({
                projet: {
                  appelOffre,
                  famille,
                  identifiantProjet,
                  legacyId,
                  localité,
                  nom,
                  numéroCRE,
                  période,
                },
                dateLimiteDépôt,
              }) => (
                <li className="list-none p-0 m-0" key={identifiantProjet}>
                  <Tile
                    className="mb-8 flex md:relative flex-col gap-2"
                    key={`depot_gf_${identifiantProjet}`}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div className="flex flex-col gap-1">
                        <Link
                          href={routes.PROJECT_DETAILS(legacyId)}
                          aria-label={`aller sur la page du projet ${nom}`}
                        >
                          {nom}
                        </Link>
                        <div className="flex flex-col md:flex-row md:gap-3">
                          <div className="text-xs italic">
                            <KeyIcon
                              className="mr-1"
                              aria-label="identification du projet : appel d'offres, période, famille, numéro CRE"
                            />
                            {appelOffre}-{période}
                            {famille && `-${famille}`}-{numéroCRE}
                          </div>
                          <div className="p-0 m-0 mt-0 text-xs italic">
                            <MapPinIcon className="mr-1" aria-label="localisation du projet" />
                            {localité.commune}, {localité.département}, {localité.région}
                          </div>
                        </div>
                      </div>
                      {isLate(dateLimiteDépôt) && (
                        <Badge
                          type="warning"
                          className="mt-2 md:mt-0"
                          aria-label="dépôt de garanties financières en retard"
                        >
                          en retard
                        </Badge>
                      )}
                    </div>
                    <div>
                      {dateLimiteDépôt && (
                        <div className="flex flex-col md:flex-row md:justify-between">
                          <div>
                            <ClockIcon className="mr-1 align-middle" aria-hidden />
                            date limite de dépôt dans Potentiel :{' '}
                            {afficherDate(new Date(dateLimiteDépôt))}
                          </div>
                          {isLate(dateLimiteDépôt) && (
                            <DownloadLink
                              fileUrl={routes.TELECHARGER_MODELE_MISE_EN_DEMEURE()}
                              className="mt-2 md:mt-0"
                              aria-label={`télécharger un modèle de mise en demeure pour le projet ${nom}`}
                            >
                              télécharger un modèle de mise en demeure
                            </DownloadLink>
                          )}
                        </div>
                      )}
                    </div>
                  </Tile>
                </li>
              ),
            )}
          </ul>
          <Pagination pageCount={pageCount} currentPage={currentPage} currentUrl={currentUrl} />
        </div>
      )}
    </PageTemplate>
  );
};

hydrateOnClient(ListeDépôtsGarantiesFinancièresEnAttente);
