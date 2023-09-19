import React from 'react';
import {
  Badge,
  ClockIcon,
  DownloadLink,
  EditIcon,
  ErrorBox,
  Heading1,
  Heading2,
  KeyIcon,
  Link,
  ListeVide,
  MapPinIcon,
  PageTemplate,
  Pagination,
  PrimaryButton,
  Tile,
} from '../../../components';
import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { DépôtGarantiesFinancièresReadModel, ProjetReadModel } from '@potentiel/domain-views';
import routes from '../../../../routes';
import { afficherDate, formatDateForInput, hydrateOnClient } from '../../../helpers';

type ListeDépôtsGarantiesFinancièresÀValiderProps = {
  user: UtilisateurReadModel;
  error?: string;
  listeDépôtsGarantiesFinancières?: ReadonlyArray<{
    dépôt: DépôtGarantiesFinancièresReadModel;
    projet: Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire'>;
  }>;
  pagination: { currentPage: number; pageCount: number; currentUrl: string; totalCount: number };
};

export const ListeDépôtsGarantiesFinancièresÀValider = ({
  user,
  error,
  listeDépôtsGarantiesFinancières,
  pagination: { currentPage, pageCount, currentUrl, totalCount },
}: ListeDépôtsGarantiesFinancièresÀValiderProps) => {
  return (
    <PageTemplate
      currentPage="liste-depots-garanties-financieres-a-valider"
      user={user}
      contentHeader={<Heading1 className="text-white">Garanties financières</Heading1>}
    >
      <Heading2>Dépôts de garanties financières à valider ({totalCount})</Heading2>
      {error && <ErrorBox className="mb-4">{error}</ErrorBox>}
      {!listeDépôtsGarantiesFinancières || !listeDépôtsGarantiesFinancières.length ? (
        <ListeVide titre="Aucun dépôt à afficher" />
      ) : (
        <div>
          <ul className="p-0 m-0">
            {listeDépôtsGarantiesFinancières.map(({ dépôt, projet }) => (
              <li className="list-none p-0 m-0" key={projet.identifiantProjet}>
                <Tile
                  className="mb-8 flex md:relative flex-col gap-2"
                  key={`depot_gf_${projet.identifiantProjet}`}
                >
                  <div className="flex md:flex-row md:justify-between">
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
                    <p className="text-sm italic self-start mt-1">
                      Dernière mise à jour : {afficherDate(new Date(dépôt.dateDernièreMiseÀJour))}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-col gap-1 md:grid md:grid-cols-4 md:grid-rows-1 md:items-center">
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
                    <div className="col-span-2">
                      {dépôt.attestationConstitution && dépôt.attestationConstitution.format && (
                        <div>
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
                      {!dépôt.typeGarantiesFinancières && (
                        <Link
                          aria-label={`Modifier le dépôt de garanties financières pour le projet ${projet.nom}`}
                          href={routes.GET_MODIFIER_DEPOT_GARANTIES_FINANCIERES_PAGE(
                            projet.identifiantProjet,
                            'liste',
                          )}
                        >
                          <EditIcon className="mr-1" aria-hidden />
                          Préciser le type de garanties financières
                        </Link>
                      )}
                    </div>

                    <form
                      method="post"
                      action={routes.POST_VALIDER_DEPOT_GARANTIES_FINANCIERES(
                        projet.identifiantProjet,
                      )}
                    >
                      <input type="hidden" name="origine" value="liste" />
                      <input
                        type="hidden"
                        value={dépôt.typeGarantiesFinancières}
                        name="typeGarantiesFinancieres"
                      />
                      <input
                        type="hidden"
                        defaultValue={dépôt.dateÉchéance && formatDateForInput(dépôt.dateÉchéance)}
                        name="dateEcheance"
                      />
                      <input
                        type="hidden"
                        defaultValue={
                          dépôt.attestationConstitution.date &&
                          formatDateForInput(dépôt.attestationConstitution.date)
                        }
                        name="dateConstitution"
                      />
                      <PrimaryButton
                        type="submit"
                        disabled={!dépôt.typeGarantiesFinancières}
                        className="mt-2"
                        confirmation="Êtes-vous sûr de vouloir valider ce dépôt de garanties financières ?"
                        aria-label={`Valider le dépôt de garanties financières pour le projet ${projet.nom}`}
                      >
                        Valider le dépôt
                      </PrimaryButton>
                      {!dépôt.typeGarantiesFinancières && (
                        <p className="text-sm italic">
                          La validation est désactivée car le type de garanties financières doit
                          être précisé.
                        </p>
                      )}
                    </form>
                  </div>
                </Tile>
              </li>
            ))}
          </ul>
          <Pagination pageCount={pageCount} currentPage={currentPage} currentUrl={currentUrl} />
        </div>
      )}
    </PageTemplate>
  );
};

hydrateOnClient(ListeDépôtsGarantiesFinancièresÀValider);
