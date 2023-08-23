import React from 'react';
import {
  AlertMessage,
  DownloadLink,
  Heading3,
  Link,
  Heading4,
  EditIcon,
  AddIcon,
  Badge,
  ClockIcon,
  ErrorIcon,
  PrimaryButton,
  Form,
  SecondaryButton,
  TrashIcon,
} from '../../../components';
import routes from '../../../../routes';
import { RawIdentifiantProjet } from '@potentiel/domain';
import { afficherDate } from '../../../helpers';
import { UserRole } from '../../../../modules/users';

export type GarantiesFinancièresDataForProjetPage = {
  actionRequise?: 'compléter enregistrement' | 'enregistrer' | 'déposer' | 'compléter dépôt';
  actuelles?: {
    typeGarantiesFinancières?: "avec date d'échéance" | 'consignation' | '6 mois après achèvement';
    dateÉchéance?: string;
    attestationConstitution?: { format: string; date: string };
  };
  dépôt?: {
    typeGarantiesFinancières?: "avec date d'échéance" | 'consignation' | '6 mois après achèvement';
    dateÉchéance?: string;
    attestationConstitution: { format: string; date: string };
  };
};

export const GarantiesFinancières = ({
  garantiesFinancières,
  identifiantProjet,
  userRole,
}: {
  garantiesFinancières?: GarantiesFinancièresDataForProjetPage;
  identifiantProjet: RawIdentifiantProjet;
  userRole: UserRole;
}) => {
  return (
    <div className="mb-6">
      <Heading3 className="m-0 flex text-sm font-semibold tracking-wide uppercase">
        garanties financières
      </Heading3>
      <div>
        {garantiesFinancières?.actionRequise && (
          <AlertMessage message={getAlertMessage(garantiesFinancières.actionRequise)} />
        )}
        <div className="flex flex-col gap-2">
          <Actuelles
            identifiantProjet={identifiantProjet}
            actionRequise={garantiesFinancières?.actionRequise}
            garantiesFinancièresActuelles={garantiesFinancières?.actuelles}
          />
          <Dépôt
            identifiantProjet={identifiantProjet}
            actionRequise={garantiesFinancières?.actionRequise}
            garantiesFinancièresDéposées={garantiesFinancières?.dépôt}
            garantiesFinancièresActuelles={garantiesFinancières?.actuelles}
            userRole={userRole}
          />
        </div>
      </div>
    </div>
  );
};

const Actuelles = ({
  garantiesFinancièresActuelles,
  actionRequise,
  identifiantProjet,
}: {
  garantiesFinancièresActuelles?: GarantiesFinancièresDataForProjetPage['actuelles'];
  identifiantProjet: RawIdentifiantProjet;
  actionRequise?: GarantiesFinancièresDataForProjetPage['actionRequise'];
}) => {
  return (
    <>
      {garantiesFinancièresActuelles ? (
        <div className="mt-2 flex flex-col gap-1">
          <Heading4 className="m-0 flex text-sm font-semibold">
            Garanties financières actuelles validées
          </Heading4>
          <AfficherGF
            type={garantiesFinancièresActuelles.typeGarantiesFinancières}
            dateÉchéance={garantiesFinancièresActuelles.dateÉchéance}
            dateConstitution={garantiesFinancièresActuelles.attestationConstitution?.date}
            formatFichier={garantiesFinancièresActuelles.attestationConstitution?.format}
            fichierUrl={routes.GET_ATTESTATION_CONSTITUTION_GARANTIES_FINANCIERES(
              identifiantProjet,
            )}
          />
          <div>
            <Link href={routes.GET_ENREGISTRER_GARANTIES_FINANCIERES_PAGE(identifiantProjet)}>
              <EditIcon className="mr-1" aria-hidden />
              mettre à jour les garanties financières
            </Link>
          </div>
        </div>
      ) : (
        actionRequise === 'enregistrer' && (
          <Link href={routes.GET_ENREGISTRER_GARANTIES_FINANCIERES_PAGE(identifiantProjet)}>
            <AddIcon className="mr-1 align-middle" aria-hidden />
            enregistrer les garanties financières soumises à la candidature
          </Link>
        )
      )}
    </>
  );
};

const Dépôt = ({
  garantiesFinancièresDéposées,
  actionRequise,
  identifiantProjet,
  userRole,
  garantiesFinancièresActuelles,
}: {
  garantiesFinancièresDéposées?: GarantiesFinancièresDataForProjetPage['dépôt'];
  identifiantProjet: RawIdentifiantProjet;
  actionRequise?: GarantiesFinancièresDataForProjetPage['actionRequise'];
  userRole: UserRole;
  garantiesFinancièresActuelles?: GarantiesFinancièresDataForProjetPage['actuelles'];
}) => {
  return (
    <>
      {garantiesFinancièresDéposées ? (
        <div className="mt-2 flex flex-col gap-1">
          <Heading4 className="m-0 flex text-sm font-semibold">
            Nouvelles garanties financières déposées
          </Heading4>
          <div>
            <Badge type="warning" className="mb-1">
              en attente de validation
            </Badge>
          </div>
          <AfficherGF
            type={garantiesFinancièresDéposées.typeGarantiesFinancières}
            dateÉchéance={garantiesFinancièresDéposées.dateÉchéance}
            dateConstitution={garantiesFinancièresDéposées.attestationConstitution.date}
            formatFichier={garantiesFinancièresDéposées.attestationConstitution.format}
            fichierUrl={routes.GET_ATTESTATION_CONSTITUTION_GARANTIES_FINANCIERES_DEPOT(
              identifiantProjet,
            )}
          />
          {userRole === 'porteur-projet' && (
            <div className="flex items-center gap-4 mt-2">
              <Link href={routes.GET_MODIFIER_DEPOT_GARANTIES_FINANCIERES_PAGE(identifiantProjet)}>
                <EditIcon className="mr-1" aria-hidden />
                Modifier le dépôt en cours
              </Link>

              <Form
                action={routes.POST_SUPPRIMER_DEPOT_GARANTIES_FINANCIERES(identifiantProjet)}
                method="post"
              >
                <SecondaryButton
                  className="!p-0 shadow-none border-none bg-transparent hover:bg-transparent focus:bg-transparent text-error-425-base underline w-fit cursor-pointer"
                  confirmation="Êtes-vous sûr de vouloir supprimer le dépôt en cours ?"
                >
                  <TrashIcon className="h-4 w-4 mr-2 align-middle text-error-425-base" />
                  Supprimer le dépôt en cours
                </SecondaryButton>
              </Form>
            </div>
          )}
          {userRole === 'dreal' && (
            <form
              method="post"
              action={routes.POST_VALIDER_DEPOT_GARANTIES_FINANCIERES(identifiantProjet)}
            >
              <PrimaryButton
                type="submit"
                className="mt-2"
                confirmation="Êtes-vous sûr de vouloir valider ce dépôt de garanties financières ?"
              >
                Valider le dépôt
              </PrimaryButton>
            </form>
          )}
          {garantiesFinancièresActuelles && (
            <div className="italic text-sm text-grey-425-base">
              <ErrorIcon className="mr-1 align-middle" aria-hidden />
              Une fois validées, ces garanties financières renplaceront les garanties financières
              actuelles.
            </div>
          )}
        </div>
      ) : actionRequise === 'déposer' && userRole === 'porteur-projet' ? (
        <Link href={routes.GET_DEPOSER_GARANTIES_FINANCIERES_PAGE(identifiantProjet)}>
          <AddIcon className="mr-1 align-middle" aria-hidden />
          déposer de nouvelles garanties financières
        </Link>
      ) : (
        actionRequise === 'déposer' && (
          <p className="m-0 italic text-sm text-grey-425-base">
            en attente de dépôt du porteur de projet
          </p>
        )
      )}
    </>
  );
};

const getAlertMessage = (actionRequise: GarantiesFinancièresDataForProjetPage['actionRequise']) => {
  switch (actionRequise) {
    case 'enregistrer':
      return 'garanties financières à enregistrer';
    case 'compléter enregistrement':
      return 'enregistrement des garanties financières à compléter';
    case 'déposer':
      return 'garanties financières à déposer';
    case 'compléter dépôt':
      return 'dépôt de garanties financières à compléter';
    default:
      return '';
  }
};

const AfficherGF = ({
  type,
  dateÉchéance,
  dateConstitution,
  fichierUrl,
  formatFichier,
}: {
  type?: `avec date d'échéance` | `consignation` | `6 mois après achèvement`;
  dateÉchéance?: string;
  dateConstitution?: string;
  formatFichier?: string;
  fichierUrl: string;
}) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:gap-8">
        {type && (
          <div>
            <Badge type="info">
              {type === '6 mois après achèvement' ? 'valides 6 mois après achèvement' : type}
            </Badge>
          </div>
        )}
        {dateÉchéance && (
          <div>
            <ClockIcon className="mr-1 align-middle" aria-hidden />
            échéance : {afficherDate(new Date(dateÉchéance))}
          </div>
        )}
      </div>
      {dateConstitution && formatFichier && (
        <DownloadLink fileUrl={fichierUrl} className="block mt-2">
          télécharger l'attestation (constituée le {afficherDate(new Date(dateConstitution))})
        </DownloadLink>
      )}
    </div>
  );
};
