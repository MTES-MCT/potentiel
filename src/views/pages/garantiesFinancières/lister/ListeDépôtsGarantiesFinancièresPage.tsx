import React from 'react';
import {
  Badge,
  ClockIcon,
  DownloadLink,
  Heading1,
  KeyIcon,
  Link,
  ListeVide,
  MapPinIcon,
  PageTemplate,
  PrimaryButton,
  Tile,
} from '../../../components';
import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { DépôtGarantiesFinancièresReadModel, ProjetReadModel } from '@potentiel/domain-views';
import routes from '../../../../routes';
import { afficherDate, hydrateOnClient } from '../../../helpers';

type ListeDépôtsGarantiesFinancièresProps = {
  user: UtilisateurReadModel;
  listeDépôtsGarantiesFinancières?: ReadonlyArray<{
    dépôt: DépôtGarantiesFinancièresReadModel;
    projet: Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire'>;
  }>;
};

export const ListeDépôtsGarantiesFinancières = ({
  user,
  listeDépôtsGarantiesFinancières,
}: ListeDépôtsGarantiesFinancièresProps) => {
  return (
    <PageTemplate
      currentPage="liste-dépôts-garanties-financières"
      user={user}
      contentHeader={<Heading1 className="text-white">Dépôts de garanties financières</Heading1>}
    >
      {!listeDépôtsGarantiesFinancières || !listeDépôtsGarantiesFinancières.length ? (
        <ListeVide titre="Aucun dépôt à afficher" />
      ) : (
        <ul className="p-0 m-0">
          {listeDépôtsGarantiesFinancières.map(({ dépôt, projet }) => (
            <li className="list-none p-0 m-0" key={projet.identifiantProjet}>
              <Tile
                className="mb-8 flex md:relative flex-col gap-2"
                key={`depot_gf_${projet.identifiantProjet}`}
              >
                <div className="flex flex-col gap-1">
                  <Link
                    href={routes.PROJECT_DETAILS(projet.legacyId)}
                    aria-label={`aller sur la page du projet ${projet.nom}`}
                  >
                    {projet.nom}
                  </Link>
                  <div className="flex flex-col md:flex-row md:gap-3">
                    <div className="text-xs italic">
                      <KeyIcon
                        className="mr-1"
                        aria-label="identification du projet : appel d'offres, période, famille, numéro CRE"
                      />
                      {projet.appelOffre}-{projet.période}
                      {projet.famille && `-${projet.famille}`}-{projet.numéroCRE}
                    </div>
                    <div className="p-0 m-0 mt-0 text-xs italic">
                      <MapPinIcon className="mr-1" aria-label="localisation du projet" />
                      {projet.localité.commune}, {projet.localité.département},{' '}
                      {projet.localité.région}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-col gap-1 md:grid md:grid-cols-4 md:grid-rows-1">
                  <div className="col-span-1">
                    {dépôt.typeGarantiesFinancières && (
                      <div>
                        <Badge type="info">
                          {dépôt.typeGarantiesFinancières === '6 mois après achèvement'
                            ? 'valides 6 mois après achèvement'
                            : dépôt.typeGarantiesFinancières}
                        </Badge>
                      </div>
                    )}
                    {dépôt.dateÉchéance && (
                      <div>
                        <ClockIcon className="mr-1 align-middle" aria-hidden />
                        échéance : {afficherDate(new Date(dépôt.dateÉchéance))}
                      </div>
                    )}
                  </div>
                  {dépôt.attestationConstitution && dépôt.attestationConstitution.format && (
                    <div className="col-span-2">
                      <DownloadLink
                        fileUrl={routes.GET_ATTESTATION_CONSTITUTION_GARANTIES_FINANCIERES_DEPOT(
                          projet.identifiantProjet,
                        )}
                        aria-label={`télécharger l'attestation de constitution des garanties financières à valider pour le projet ${projet.nom}`}
                      >
                        télécharger l'attestation (constituée le{' '}
                        {afficherDate(new Date(dépôt.attestationConstitution.date))})
                      </DownloadLink>
                    </div>
                  )}
                  <form
                    className="col-span-1"
                    method="post"
                    action={routes.POST_VALIDER_DEPOT_GARANTIES_FINANCIERES(
                      projet.identifiantProjet,
                    )}
                  >
                    <PrimaryButton
                      type="submit"
                      confirmation="Êtes-vous sûr de vouloir valider ce dépôt de garanties financières ?"
                      aria-label={`valider le dépôt de garanties financières pour le projet ${projet.nom}`}
                    >
                      Valider le dépôt
                    </PrimaryButton>
                  </form>
                </div>
              </Tile>
            </li>
          ))}
        </ul>
      )}
    </PageTemplate>
  );
};

hydrateOnClient(ListeDépôtsGarantiesFinancières);
