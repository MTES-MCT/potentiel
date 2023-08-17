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
        <div className="mt-2">
          <Heading4 className="m-0 flex text-sm font-semibold">
            Garanties financières actuelles validées
          </Heading4>
          <AfficherGF
            type={garantiesFinancièresActuelles.typeGarantiesFinancières}
            dateÉchéance={garantiesFinancièresActuelles.dateÉchéance}
            dateConstitution={garantiesFinancièresActuelles.attestationConstitution?.date}
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
}: {
  garantiesFinancièresDéposées?: GarantiesFinancièresDataForProjetPage['dépôt'];
  identifiantProjet: RawIdentifiantProjet;
  actionRequise?: GarantiesFinancièresDataForProjetPage['actionRequise'];
  userRole: UserRole;
}) => {
  return (
    <>
      {garantiesFinancièresDéposées ? (
        <div className="mt-2">
          <Heading4 className="m-0 flex text-sm font-semibold">
            Nouvelles garanties financières déposées{' '}
            <Badge type="info" className="ml-2 align-baseline">
              en attente de validation
            </Badge>
          </Heading4>
          <AfficherGF
            type={garantiesFinancièresDéposées.typeGarantiesFinancières}
            dateÉchéance={garantiesFinancièresDéposées.dateÉchéance}
            dateConstitution={garantiesFinancièresDéposées.attestationConstitution.date}
            fichierUrl={routes.GET_ATTESTATION_CONSTITUTION_GARANTIES_FINANCIERES_DEPOT(
              identifiantProjet,
            )}
          />
          {userRole === 'porteur-projet' && (
            <div>
              <Link href={routes.GET_MODIFIER_DEPOT_GARANTIES_FINANCIERES_PAGE(identifiantProjet)}>
                <EditIcon className="mr-1" aria-hidden />
                modifier le dépôt en cours
              </Link>
            </div>
          )}
        </div>
      ) : (
        actionRequise === 'déposer' &&
        userRole === 'porteur-projet' && (
          <Link href={routes.GET_DEPOSER_GARANTIES_FINANCIERES_PAGE(identifiantProjet)}>
            <AddIcon className="mr-1 align-middle" aria-hidden />
            déposer de nouvelles garanties financières
          </Link>
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
}: {
  type?: `avec date d'échéance` | `consignation` | `6 mois après achèvement`;
  dateÉchéance?: string;
  dateConstitution?: string;
  fichierUrl: string;
}) => {
  return (
    <>
      {type === "avec date d'échéance" && dateÉchéance && (
        <div>
          Garanties Financières avec date d'échéance au {afficherDate(new Date(dateÉchéance))}
        </div>
      )}
      {type === '6 mois après achèvement' && (
        <div>Garanties Financières valides jusqu'à six mois après l'achèvement</div>
      )}
      {type === 'consignation' && <div>Garanties financières de type consignation</div>}

      {dateConstitution && (
        <DownloadLink fileUrl={fichierUrl}>
          télécharger l'attestation (constituée le {afficherDate(new Date(dateConstitution))})
        </DownloadLink>
      )}
    </>
  );
};
