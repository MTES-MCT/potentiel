import React, { ComponentProps } from 'react';
import { ProjectDataForProjectPage } from '../../../../modules/project';
import { BuildingIcon, Heading3, Link, Section, WarningIcon } from '../../../components';
import { UserRole } from '../../../../modules/users';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../../helpers/dataToValueTypes';
import { afficherDate } from '../../../helpers';
import { Routes } from '@potentiel-applications/routes';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Candidature } from '@potentiel-domain/candidature';
import { Role } from '@potentiel-domain/utilisateur';

export type InfoGeneralesProps = {
  project: ProjectDataForProjectPage;
  role: UserRole;
  demandeRecours: ProjectDataForProjectPage['demandeRecours'];
  garantiesFinancières?: GarantiesFinancièresProjetProps['garantiesFinancières'];
};

export const InfoGenerales = ({
  project: {
    appelOffreId,
    periodeId,
    familleId,
    numeroCRE,
    appelOffre,
    puissance,
    isClasse,
    isAbandoned,
    désignationCatégorie,
    codePostalProjet,
    communeProjet,
    regionProjet,
    departementProjet,
    adresseProjet,
  },
  role,
  garantiesFinancières,
  demandeRecours,
}: InfoGeneralesProps) => {
  const puissanceInférieurePuissanceMaxVolRéservé =
    appelOffre.periode.noteThresholdBy === 'category' &&
    puissance < appelOffre.periode.noteThreshold.volumeReserve.puissanceMax;

  const shouldDisplayGf =
    isClasse &&
    [
      'admin',
      'dgec-validateur',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ].includes(role);

  const formattedIdentifiantProjet = formatProjectDataToIdentifiantProjetValueType({
    appelOffreId,
    periodeId,
    familleId,
    numeroCRE,
  }).formatter();

  return (
    <Section title="Informations générales" icon={<BuildingIcon />} className="flex gap-5 flex-col">
      {garantiesFinancières && shouldDisplayGf && (
        <GarantiesFinancièresProjet
          garantiesFinancières={garantiesFinancières}
          project={{
            appelOffreId,
            periodeId,
            familleId,
            numeroCRE,
          }}
        />
      )}
      {demandeRecours &&
        Role.convertirEnValueType(role).aLaPermission('recours.consulter.détail') && (
          <div className="print:hidden">
            <Heading3 className="m-0">Recours</Heading3>
            <Link href={Routes.Recours.détail(formattedIdentifiantProjet)}>
              Recours {demandeRecours.statut}
            </Link>
          </div>
        )}

      {isClasse &&
        !isAbandoned &&
        ['admin', 'dgec-validateur', 'porteur-projet', 'dreal', 'acheteur-obligé', 'cre'].includes(
          role,
        ) &&
        appelOffre.typeAppelOffre !== 'biométhane' && (
          <div className="print:hidden">
            <Heading3 className="m-0">Raccordement au réseau</Heading3>
            <Link
              href={Routes.Raccordement.détail(
                formatProjectDataToIdentifiantProjetValueType({
                  appelOffreId,
                  periodeId,
                  familleId,
                  numeroCRE,
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
          {appelOffre.typeAppelOffre === 'biométhane'
            ? `Production annuelle prévisionnelle`
            : `Puissance installée`}{' '}
          : {puissance} {appelOffre?.unitePuissance}
        </p>
        {désignationCatégorie === 'volume-réservé' && (
          <p className="mb-0 mt-1">Ce projet fait partie du volume réservé de la période.</p>
        )}
        {désignationCatégorie === 'hors-volume-réservé' &&
          puissanceInférieurePuissanceMaxVolRéservé && (
            <p className="mb-0 mt-1">
              Ce projet ne fait pas partie du volume réservé de la période.
            </p>
          )}
      </div>

      <div>
        <Heading3 className="m-0">Site de production</Heading3>
        <p className="m-0">{adresseProjet}</p>
        <p className="m-0">
          {codePostalProjet} {communeProjet}
        </p>
        <p className="m-0">
          {departementProjet}, {regionProjet}
        </p>
      </div>
    </Section>
  );
};

export type GarantiesFinancièresProjetProps = {
  garantiesFinancières: {
    motifGfEnAttente?: GarantiesFinancières.MotifDemandeGarantiesFinancières.RawType;
    actuelles?: {
      type?: Candidature.TypeGarantiesFinancières.RawType;
      dateConstitution?: string;
      dateÉchéance?: string;
    };
    dépôtÀTraiter?: {
      type?: Candidature.TypeGarantiesFinancières.RawType;
      dateConstitution: string;
      dateÉchéance?: string;
    };
  };
  project: {
    appelOffreId: string;
    periodeId: string;
    familleId: string;
    numeroCRE: string;
  };
};

const GarantiesFinancièresProjet = ({
  garantiesFinancières,
  project: { appelOffreId, periodeId, familleId, numeroCRE },
}: GarantiesFinancièresProjetProps) => {
  const motifDemandeGarantiesFinancières =
    garantiesFinancières.motifGfEnAttente &&
    getMotifGFEnAttente(garantiesFinancières.motifGfEnAttente);

  return (
    <div>
      <Heading3 className="m-0">Garanties financières</Heading3>
      {garantiesFinancières.motifGfEnAttente && (
        <AlertMessage>
          Des garanties financières sont en attente pour ce projet
          {motifDemandeGarantiesFinancières ? <> ({motifDemandeGarantiesFinancières})</> : ''}.
        </AlertMessage>
      )}

      {garantiesFinancières.actuelles && (
        <>
          <p className="mt-0 mb-3">
            Le projet dispose actuellement de garanties financières validées
            {garantiesFinancières.actuelles.dateConstitution && (
              <>
                , constituées le{' '}
                {afficherDate(new Date(garantiesFinancières.actuelles.dateConstitution))}
              </>
            )}
            {garantiesFinancières.actuelles.type !== 'type-inconnu' && (
              <span className="font-semibold">
                , {getGFLabel(garantiesFinancières.actuelles.type)}
              </span>
            )}
            {garantiesFinancières.actuelles.dateÉchéance &&
              garantiesFinancières.actuelles.type === 'avec-date-échéance' && (
                <span>
                  {' '}
                  au {afficherDate(new Date(garantiesFinancières.actuelles.dateÉchéance))}
                </span>
              )}
            .
          </p>
          {!garantiesFinancières.actuelles?.dateConstitution && (
            <AlertMessage>
              L'attestation de constitution des garanties financières reste à transmettre.
            </AlertMessage>
          )}
          {garantiesFinancières.actuelles.type === 'type-inconnu' && (
            <AlertMessage>Le type de garanties financières reste à préciser.</AlertMessage>
          )}
        </>
      )}

      {garantiesFinancières.dépôtÀTraiter && (
        <AlertMessage>
          De nouvelles garanties financières {getGFLabel(garantiesFinancières.dépôtÀTraiter?.type)},
          constituées le{' '}
          {afficherDate(new Date(garantiesFinancières.dépôtÀTraiter.dateConstitution))}
          {garantiesFinancières.dépôtÀTraiter.dateÉchéance && (
            <span>
              {' '}
              et avec échéance au{' '}
              {afficherDate(new Date(garantiesFinancières.dépôtÀTraiter.dateÉchéance))}{' '}
            </span>
          )}{' '}
          sont à traiter par l'autorité compétente (
          <Link
            href={Routes.GarantiesFinancières.détail(
              formatProjectDataToIdentifiantProjetValueType({
                appelOffreId,
                periodeId,
                familleId,
                numeroCRE,
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
            appelOffreId,
            periodeId,
            familleId,
            numeroCRE,
          }).formatter(),
        )}
      >
        Modifier, consulter ou lever les garanties financières du projet
      </Link>
    </div>
  );
};

const getGFLabel = (type?: Candidature.TypeGarantiesFinancières.RawType) => {
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

const getMotifGFEnAttente = (
  motif?: GarantiesFinancières.MotifDemandeGarantiesFinancières.RawType,
) => {
  switch (motif) {
    case 'recours-accordé':
      return 'recours accordé';
    case 'changement-producteur':
      return 'changement de producteur';
    case 'échéance-garanties-financières-actuelles':
      return 'garanties financières arrivant à échéance';
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
