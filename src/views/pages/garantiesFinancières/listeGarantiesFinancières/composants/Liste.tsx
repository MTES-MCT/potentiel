import React from 'react';
import routes from '../../../../../routes';
import { PaginatedList } from '../../../../../modules/pagination';
import {
  Tile,
  MapPinIcon,
  Pagination,
  Link,
  EditIcon,
  AddIcon,
  Badge,
  PrimaryButton,
  ErrorIcon,
  ClockIcon,
  DownloadLink,
  KeyIcon,
} from '../../../../components';
import { UserRole } from '../../../../../modules/users';
import { convertirEnIdentifiantProjet } from '@potentiel/domain';
import { afficherDate } from '../../../../helpers';
import { GarantiesFinancièresListItem } from '../ListeGarantiesFinancieresPage';

type Props = {
  className?: string;
  userRole: UserRole;
  projects: PaginatedList<GarantiesFinancièresListItem>;
  GFPastDue?: boolean;
  currentUrl: string;
};

export const Liste = ({ className = '', projects, currentUrl, userRole }: Props) => {
  return (
    <div className={className}>
      <ul className="p-0 m-0">
        {projects.items.map((project) => (
          <li className="list-none p-0 m-0" key={project.id}>
            <Tile className="mb-8 flex md:relative flex-col gap-2" key={`project_${project.id}`}>
              <div>
                <ContexteProjet
                  projetId={project.id}
                  nomProjet={project.nomProjet}
                  commune={project.communeProjet}
                  département={project.departementProjet}
                  région={project.regionProjet}
                  appelOffre={project.appelOffre.title}
                  période={project.appelOffre.periode}
                  famille={project.appelOffre.famille}
                  numéroCRE={project.numeroCRE}
                />
              </div>
              <div>
                <GarantiesFinancières
                  garantiesFinancières={project.garantiesFinancières}
                  identifiantProjet={convertirEnIdentifiantProjet({
                    appelOffre: project.appelOffre.title,
                    période: project.appelOffre.periode,
                    famille: project.appelOffre.famille,
                    numéroCRE: project.numeroCRE,
                  }).formatter()}
                  nomProjet={project.nomProjet}
                />
              </div>
            </Tile>
          </li>
        ))}
      </ul>
      {!Array.isArray(projects) && (
        <Pagination
          pageCount={projects.pageCount}
          currentPage={projects.pagination.page}
          currentUrl={currentUrl}
        />
      )}
    </div>
  );
};

const ContexteProjet = ({
  appelOffre,
  période,
  numéroCRE,
  commune,
  département,
  région,
  famille,
  projetId,
  nomProjet,
}: {
  appelOffre: string;
  période: string;
  numéroCRE: string;
  commune: string;
  département: string;
  région: string;
  famille: string;
  projetId: string;
  nomProjet: string;
}) => (
  <div className="flex flex-col gap-1">
    <Link href={routes.PROJECT_DETAILS(projetId)}>{nomProjet}</Link>
    <div className="flex flex-col md:flex-row md:gap-3">
      <div className="text-xs italic">
        <KeyIcon className="mr-1" />
        {appelOffre}-{période}
        {famille && `-${famille}`}-{numéroCRE}
      </div>
      <div className="p-0 m-0 mt-0 text-xs italic">
        <MapPinIcon className="mr-1" />
        {commune}, {département}, {région}
      </div>
    </div>
  </div>
);

const GarantiesFinancières = ({ garantiesFinancières, identifiantProjet, nomProjet }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6">
        <Dépôt
          nomProjet={nomProjet}
          identifiantProjet={identifiantProjet}
          actionRequise={garantiesFinancières?.actionRequise}
          garantiesFinancièresDéposées={garantiesFinancières?.dépôt}
        />
        {garantiesFinancières.actuelles && garantiesFinancières.dépôt && (
          <div
            className="border border-solid border-grey-925-base border-b-[0px]"
            aria-hidden
          ></div>
        )}
        <Actuelles
          nomProjet={nomProjet}
          identifiantProjet={identifiantProjet}
          actionRequise={garantiesFinancières?.actionRequise}
          garantiesFinancièresActuelles={garantiesFinancières?.actuelles}
        />
      </div>
      {garantiesFinancières.actuelles && garantiesFinancières.dépôt && (
        <div className="italic text-sm text-grey-425-base mt-4">
          <ErrorIcon className="mr-1 align-middle" aria-hidden />
          une fois validé, le dépôt remplacera les garanties financières actuelles
        </div>
      )}
    </div>
  );
};

const Actuelles = ({
  garantiesFinancièresActuelles,
  actionRequise,
  identifiantProjet,
  nomProjet,
}) => {
  return (
    <>
      {garantiesFinancièresActuelles ? (
        <div className="mt-2 flex flex-col gap-1 md:grid md:grid-cols-5 md:grid-rows-1">
          <div className="col-span-1">
            <Badge type="success">Actuelles</Badge>
          </div>
          <div className="col-span-4">
            <AfficherGF
              nomProjet={nomProjet}
              type={garantiesFinancièresActuelles.typeGarantiesFinancières}
              dateÉchéance={garantiesFinancièresActuelles.dateÉchéance}
              dateConstitution={garantiesFinancièresActuelles.attestationConstitution?.date}
              formatFichier={garantiesFinancièresActuelles.attestationConstitution?.format}
              fichierUrl={routes.GET_ATTESTATION_CONSTITUTION_GARANTIES_FINANCIERES(
                identifiantProjet,
              )}
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
        actionRequise === 'enregistrer' && (
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

const Dépôt = ({ garantiesFinancièresDéposées, actionRequise, identifiantProjet, nomProjet }) => {
  return (
    <>
      {garantiesFinancièresDéposées ? (
        <div className="mt-2 flex flex-col gap-1 md:grid md:grid-cols-5 md:grid-rows-1">
          <div>
            <Badge type="warning" className="col-span-1">
              Dépôt à valider
            </Badge>
          </div>
          <div className="col-span-3">
            <AfficherGF
              dépôt={true}
              nomProjet={nomProjet}
              type={garantiesFinancièresDéposées.typeGarantiesFinancières}
              dateÉchéance={garantiesFinancièresDéposées.dateÉchéance}
              dateConstitution={garantiesFinancièresDéposées.attestationConstitution.date}
              formatFichier={garantiesFinancièresDéposées.attestationConstitution.format}
              fichierUrl={routes.GET_ATTESTATION_CONSTITUTION_GARANTIES_FINANCIERES_DEPOT(
                identifiantProjet,
              )}
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
        actionRequise === 'déposer' && (
          <p className="mb-0 mt-2 italic text-sm text-grey-425-base">
            garanties financières en attente de dépôt du porteur de projet
          </p>
        )
      )}
    </>
  );
};

const AfficherGF = ({
  type,
  dateÉchéance,
  dateConstitution,
  fichierUrl,
  formatFichier,
  nomProjet,
  dépôt,
  children,
}: {
  type;
  dateÉchéance;
  dateConstitution;
  fichierUrl;
  formatFichier;
  nomProjet;
  dépôt?: true;
  children?;
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
        <div>
          <DownloadLink
            fileUrl={fichierUrl}
            aria-label={`télécharger l'attestation de constitution des garanties financières ${
              dépôt ? 'à valider' : 'validées'
            } pour le projet ${nomProjet}`}
          >
            télécharger l'attestation (constituée le {afficherDate(new Date(dateConstitution))})
          </DownloadLink>
        </div>
      )}
      {children && <div>{children}</div>}
    </div>
  );
};
