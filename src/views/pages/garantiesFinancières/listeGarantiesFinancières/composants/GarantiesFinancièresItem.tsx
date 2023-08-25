import React from 'react';
import routes from '../../../../../routes';
import {
  ErrorIcon,
  Badge,
  EditIcon,
  AddIcon,
  PrimaryButton,
  ClockIcon,
  DownloadLink,
  Link,
} from '../../../../components';
import { afficherDate } from '../../../../helpers';
import {
  GarantiesFinancièresListItem,
  ProjectGarantiesFinancièresData,
} from '../../../../../modules/garantiesFinancières';
import { RawIdentifiantProjet } from '@potentiel/domain';

export const GarantiesFinancièresItem = ({
  garantiesFinancières,
  identifiantProjet,
  nomProjet,
}: {
  garantiesFinancières: GarantiesFinancièresListItem['garantiesFinancières'];
  identifiantProjet: RawIdentifiantProjet;
  nomProjet: GarantiesFinancièresListItem['nomProjet'];
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6">
        <Dépôt
          nomProjet={nomProjet}
          identifiantProjet={identifiantProjet}
          garantiesFinancières={garantiesFinancières}
        />
        {garantiesFinancières?.actuelles && garantiesFinancières?.dépôt && (
          <div
            className="border border-solid border-grey-925-base border-b-[0px]"
            aria-hidden
          ></div>
        )}
        <Actuelles
          nomProjet={nomProjet}
          identifiantProjet={identifiantProjet}
          garantiesFinancières={garantiesFinancières}
        />
      </div>
      {garantiesFinancières?.actuelles && garantiesFinancières?.dépôt && (
        <div className="italic text-sm text-grey-425-base mt-4">
          <ErrorIcon className="mr-1 align-middle" aria-hidden />
          une fois validé, le dépôt remplacera les garanties financières actuelles
        </div>
      )}
    </div>
  );
};

const Actuelles = ({
  garantiesFinancières,
  identifiantProjet,
  nomProjet,
}: {
  garantiesFinancières: GarantiesFinancièresListItem['garantiesFinancières'];
  identifiantProjet: RawIdentifiantProjet;
  nomProjet: GarantiesFinancièresListItem['nomProjet'];
}) => {
  return (
    <>
      {garantiesFinancières?.actuelles ? (
        <div className="mt-2 flex flex-col gap-1 md:grid md:grid-cols-5 md:grid-rows-1">
          <div className="col-span-1">
            <Badge type="success">Actuelles</Badge>
          </div>
          <div className="col-span-4">
            <AfficherGF
              nomProjet={nomProjet}
              état={garantiesFinancières.actuelles}
              statut="actuelles"
              identifiantProjet={identifiantProjet}
            >
              <Link
                href={routes.GET_ENREGISTRER_GARANTIES_FINANCIERES_PAGE(identifiantProjet)}
                aria-label={`compléter l'enregistrement de garanties financières pour le projet ${nomProjet}`}
              >
                <EditIcon className="mr-1" aria-hidden />
                compléter
              </Link>
            </AfficherGF>
          </div>
        </div>
      ) : (
        garantiesFinancières?.actionRequise === 'enregistrer' && (
          <Link
            href={routes.GET_ENREGISTRER_GARANTIES_FINANCIERES_PAGE(identifiantProjet)}
            aria-label={`enregistrer les garanties financières pour le projet ${nomProjet}`}
          >
            <AddIcon className="mr-1 align-middle" aria-hidden />
            enregistrer les garanties financières soumises à la candidature
          </Link>
        )
      )}
    </>
  );
};

const Dépôt = ({
  garantiesFinancières,
  identifiantProjet,
  nomProjet,
}: {
  garantiesFinancières: GarantiesFinancièresListItem['garantiesFinancières'];
  identifiantProjet: RawIdentifiantProjet;
  nomProjet: GarantiesFinancièresListItem['nomProjet'];
}) => {
  return (
    <>
      {garantiesFinancières?.dépôt ? (
        <div className="mt-2 flex flex-col gap-1 md:grid md:grid-cols-5 md:grid-rows-1">
          <div>
            <Badge type="warning" className="col-span-1">
              Dépôt à valider
            </Badge>
          </div>
          <div className="col-span-3">
            <AfficherGF
              nomProjet={nomProjet}
              statut="dépôt"
              état={garantiesFinancières.dépôt}
              identifiantProjet={identifiantProjet}
            />
          </div>
          <form
            className="col-span-1"
            method="post"
            action={routes.POST_VALIDER_DEPOT_GARANTIES_FINANCIERES(identifiantProjet)}
          >
            <PrimaryButton
              type="submit"
              className="mt-2"
              confirmation="Êtes-vous sûr de vouloir valider ce dépôt de garanties financières ?"
              aria-label={`valider le dépôt de garanties financières pour le projet ${nomProjet}`}
            >
              Valider le dépôt
            </PrimaryButton>
          </form>
        </div>
      ) : (
        garantiesFinancières?.actionRequise === 'déposer' && (
          <p className="mb-0 mt-2 italic text-sm text-grey-425-base">
            garanties financières en attente de dépôt du porteur de projet
          </p>
        )
      )}
    </>
  );
};

const AfficherGF = ({
  nomProjet,
  statut,
  état,
  identifiantProjet,
  children,
}: {
  nomProjet: GarantiesFinancièresListItem['nomProjet'];
  statut: 'actuelles' | 'dépôt';
  état:
    | Exclude<ProjectGarantiesFinancièresData['actuelles'], undefined>
    | Exclude<ProjectGarantiesFinancièresData['dépôt'], undefined>;
  identifiantProjet: RawIdentifiantProjet;
  children?: React.ReactNode;
}) => {
  const fichierUrl =
    statut === 'actuelles'
      ? routes.GET_ATTESTATION_CONSTITUTION_GARANTIES_FINANCIERES(identifiantProjet)
      : routes.GET_ATTESTATION_CONSTITUTION_GARANTIES_FINANCIERES_DEPOT(identifiantProjet);
  return (
    <div>
      <div className="flex flex-col md:flex-row md:gap-8">
        {état.typeGarantiesFinancières && (
          <div>
            <Badge type="info">
              {état.typeGarantiesFinancières === '6 mois après achèvement'
                ? 'valides 6 mois après achèvement'
                : état.typeGarantiesFinancières}
            </Badge>
          </div>
        )}
        {état.dateÉchéance && (
          <div>
            <ClockIcon className="mr-1 align-middle" aria-hidden />
            échéance : {afficherDate(new Date(état.dateÉchéance))}
          </div>
        )}
      </div>
      {état.attestationConstitution && état.attestationConstitution.format && (
        <div>
          <DownloadLink
            fileUrl={fichierUrl}
            aria-label={`télécharger l'attestation de constitution des garanties financières ${
              statut === 'dépôt' ? 'à valider' : 'validées'
            } pour le projet ${nomProjet}`}
          >
            télécharger l'attestation (constituée le{' '}
            {afficherDate(new Date(état.attestationConstitution.date))})
          </DownloadLink>
        </div>
      )}
      {children && <div>{children}</div>}
    </div>
  );
};
