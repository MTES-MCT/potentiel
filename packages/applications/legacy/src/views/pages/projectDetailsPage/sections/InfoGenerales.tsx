import React, { ComponentProps } from 'react';
import { ProjectDataForProjectPage } from '../../../../modules/project';
import { BuildingIcon, Heading3, Link, Section, WarningIcon } from '../../../components';
import { UserRole } from '../../../../modules/users';
import { Routes } from '@potentiel-libraries/routes';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../../helpers/dataToValueTypes';
import { afficherDate } from '../../../helpers';

type InfoGeneralesProps = {
  project: ProjectDataForProjectPage;
  role: UserRole;
};

export const InfoGenerales = ({ project, role }: InfoGeneralesProps) => {
  const puissanceInférieurePuissanceMaxVolRéservé =
    project.appelOffre.periode.noteThresholdBy === 'category' &&
    project.puissance < project.appelOffre.periode.noteThreshold.volumeReserve.puissanceMax;

  return (
    <Section title="Informations générales" icon={<BuildingIcon />} className="flex gap-5 flex-col">
      <GarantiesFinancières role={role} project={project} />

      {project.isClasse &&
        !project.isAbandoned &&
        ['admin', 'dgec-validateur', 'porteur-projet', 'dreal', 'acheteur-obligé', 'cre'].includes(
          role,
        ) && (
          <div className="print:hidden">
            <Heading3 className="m-0">Raccordement au réseau</Heading3>
            <Link
              href={Routes.Raccordement.détail(
                formatProjectDataToIdentifiantProjetValueType({
                  appelOffreId: project.appelOffreId,
                  periodeId: project.periodeId,
                  familleId: project.familleId,
                  numeroCRE: project.numeroCRE,
                }).formatter(),
              )}
            >
              Mettre à jour ou consulter les données de raccordement
            </Link>
          </div>
        )}
      <div>
        <Heading3 className="m-0">Performances</Heading3>
        <p className="m-0">
          {project.appelOffre.typeAppelOffre === 'biométhane'
            ? `Production annuelle prévisionnelle`
            : `Puissance installée`}{' '}
          : {project.puissance} {project.appelOffre?.unitePuissance}
        </p>
        {project.désignationCatégorie === 'volume-réservé' && (
          <p className="mb-0 mt-1">Ce projet fait partie du volume réservé de la période.</p>
        )}
        {project.désignationCatégorie === 'hors-volume-réservé' &&
          puissanceInférieurePuissanceMaxVolRéservé && (
            <p className="mb-0 mt-1">
              Ce projet ne fait pas partie du volume réservé de la période.
            </p>
          )}
      </div>

      <div>
        <Heading3 className="m-0">Site de production</Heading3>
        <p className="m-0">{project.adresseProjet}</p>
        <p className="m-0">
          {project.codePostalProjet} {project.communeProjet}
        </p>
        <p className="m-0">
          {project.departementProjet}, {project.regionProjet}
        </p>
      </div>
    </Section>
  );
};

type GarantiesFinancièresProps = { project: ProjectDataForProjectPage; role: UserRole };
const GarantiesFinancières = ({ project, role }: GarantiesFinancièresProps) => (
  <div>
    {project.garantiesFinancières &&
    project.isClasse &&
    !project.isAbandoned &&
    [
      'admin',
      'dgec-validateur',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ].includes(role) ? (
      <div>
        <Heading3 className="m-0">Garanties financières</Heading3>
        {project.garantiesFinancières.garantiesFinancièresEnAttente && (
          <AlertMessage>Des garanties financières sont en attente pour ce projet.</AlertMessage>
        )}

        {project.garantiesFinancières.actuelles && (
          <p className="mt-0 mb-3">
            Le projet dispose actuellement de{' '}
            <span className="font-semibold">
              garanties financières validées{' '}
              {getGFLabel(project.garantiesFinancières.actuelles.type)}
            </span>
            , constituées le{' '}
            {afficherDate(new Date(project.garantiesFinancières.actuelles.dateConstitution))}
            {project.garantiesFinancières.actuelles.dateÉchéance && (
              <span>
                {' '}
                et avec échéance au{' '}
                {afficherDate(new Date(project.garantiesFinancières.actuelles.dateÉchéance))}
              </span>
            )}
            .
          </p>
        )}

        {project.garantiesFinancières.dépôtÀTraiter && (
          <AlertMessage>
            De nouvelles garanties financières{' '}
            {getGFLabel(project.garantiesFinancières.dépôtÀTraiter?.type)}, constituées le{' '}
            {afficherDate(new Date(project.garantiesFinancières.dépôtÀTraiter.dateConstitution))}
            {project.garantiesFinancières.dépôtÀTraiter.dateÉchéance && (
              <span>
                {' '}
                et avec échéance au{' '}
                {afficherDate(
                  new Date(project.garantiesFinancières.dépôtÀTraiter.dateÉchéance),
                )}{' '}
              </span>
            )}{' '}
            sont à traiter par l'autorité compétente (
            <Link
              href={Routes.GarantiesFinancières.détail(
                formatProjectDataToIdentifiantProjetValueType({
                  appelOffreId: project.appelOffreId,
                  periodeId: project.periodeId,
                  familleId: project.familleId,
                  numeroCRE: project.numeroCRE,
                }).formatter(),
              )}
            >
              voir le détail
            </Link>
            ).
          </AlertMessage>
        )}

        <Link
          href={Routes.GarantiesFinancières.détail(
            formatProjectDataToIdentifiantProjetValueType({
              appelOffreId: project.appelOffreId,
              periodeId: project.periodeId,
              familleId: project.familleId,
              numeroCRE: project.numeroCRE,
            }).formatter(),
          )}
        >
          Mettre à jour ou consulter les garanties financières du projet
        </Link>
      </div>
    ) : (
      <></>
    )}
  </div>
);

const getGFLabel = (type: string) => {
  switch (type) {
    case 'consignation':
      return 'de type consignation';
    case 'avec-date-échéance':
      return "avec date d'échéance";
    case 'six-mois-après-achèvement':
      return "avec une durée de validité jusqu'à six mois après achèvement du projet";
    default:
      return '';
  }
};

type AlertMessageProps = ComponentProps<'div'>;
const AlertMessage = ({ children }: AlertMessageProps) => {
  return (
    <div className="text-red-700 italic mb-2">
      <WarningIcon title="Information alerte" className="text-lg -mb-1 shrink-0" /> {children}
    </div>
  );
};
