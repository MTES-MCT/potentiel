import React, { ComponentProps } from 'react';
import { ProjectDataForProjectPage } from '../../../../../modules/project';
import { BuildingIcon, Heading3, Link, Section, WarningIcon } from '../../../../components';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../../../helpers/dataToValueTypes';
import { afficherDate } from '../../../../helpers';
import { Routes } from '@potentiel-applications/routes';
import { match } from 'ts-pattern';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import type { Candidature } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';
import { Raccordement } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { InfoActionnaire } from './InfoActionnaire';
import { InfoPuissance } from './InfoPuissance';
import { GetActionnaireForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils';
import { GetPuissanceForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getPuissance';

export type InfoGeneralesProps = {
  project: ProjectDataForProjectPage;
  role: Role.ValueType;
  raccordement: Option.Type<Raccordement.ConsulterRaccordementReadModel>;
  demandeRecours: ProjectDataForProjectPage['demandeRecours'];
  garantiesFinancières?: GarantiesFinancièresProjetProps['garantiesFinancières'];
  actionnaire?: GetActionnaireForProjectPage;
  puissance?: GetPuissanceForProjectPage;
  modificationsNonPermisesParLeCDCActuel: boolean;
  coefficientKChoisi: boolean | undefined;
};

export const InfoGenerales = ({
  project: {
    appelOffreId,
    periodeId,
    familleId,
    numeroCRE,
    appelOffre,
    puissance: legacyPuissance,
    isClasse,
    désignationCatégorie,
    codePostalProjet,
    communeProjet,
    regionProjet,
    departementProjet,
    adresseProjet,
    isAbandoned,
  },
  raccordement,
  role,
  garantiesFinancières,
  demandeRecours,
  actionnaire,
  modificationsNonPermisesParLeCDCActuel,
  puissance,
  coefficientKChoisi,
}: InfoGeneralesProps) => {
  const puissanceInférieurePuissanceMaxVolRéservé =
    appelOffre.periode.noteThresholdBy === 'category' &&
    legacyPuissance < appelOffre.periode.noteThreshold.volumeReserve.puissanceMax;

  const identifiantProjet = formatProjectDataToIdentifiantProjetValueType({
    appelOffreId,
    periodeId,
    familleId,
    numeroCRE,
  });

  const formattedIdentifiantProjet = identifiantProjet.formatter();

  return (
    <Section title="Informations générales" icon={<BuildingIcon />} className="flex gap-5 flex-col">
      {garantiesFinancières && isClasse && (
        <GarantiesFinancièresProjet
          garantiesFinancières={garantiesFinancières}
          identifiantProjet={identifiantProjet}
          peutModifier={
            role.aLaPermission('garantiesFinancières.actuelles.modifier') ||
            role.aLaPermission('garantiesFinancières.dépôt.modifier')
          }
          peutLever={role.aLaPermission('garantiesFinancières.mainlevée.demander')}
        />
      )}
      {demandeRecours && role.aLaPermission('recours.consulter.détail') && (
        <div className="print:hidden">
          <Heading3 className="m-0">Recours</Heading3>
          <Link href={Routes.Recours.détail(formattedIdentifiantProjet)}>
            Recours {demandeRecours.statut.split('-').join(' ')}
          </Link>
        </div>
      )}
      <div className="print:hidden">
        <Heading3 className="m-0">Raccordement au réseau</Heading3>
        {match({
          raccordement: Option.isSome(raccordement),
          isClasse,
          isAbandoned,
          modifierPermission: role.aLaPermission('raccordement.gestionnaire.modifier'),
        })
          .with({ raccordement: true }, ({ modifierPermission }) => (
            <Link href={Routes.Raccordement.détail(formattedIdentifiantProjet)}>
              {modifierPermission
                ? 'Consulter ou modifier les documents'
                : 'Consulter les documents'}
            </Link>
          ))
          .with(
            {
              raccordement: false,
              isClasse: true,
              isAbandoned: false,
              modifierPermission: true,
            },
            () => (
              <Link href={Routes.Raccordement.détail(formattedIdentifiantProjet)}>
                Renseigner les données de raccordement
              </Link>
            ),
          )
          .otherwise(() => (
            <div>Aucun raccordement pour ce projet</div>
          ))}
      </div>
      {puissance !== undefined && (
        <InfoPuissance
          puissance={puissance}
          modificationsPermisesParLeCDCActuel={!modificationsNonPermisesParLeCDCActuel}
          unitePuissance={appelOffre.unitePuissance}
          désignationCatégorie={désignationCatégorie}
          puissanceInférieurePuissanceMaxVolRéservé={puissanceInférieurePuissanceMaxVolRéservé}
        />
      )}
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
      {actionnaire && (
        <InfoActionnaire
          actionnaire={actionnaire}
          modificationsPermisesParLeCDCActuel={!modificationsNonPermisesParLeCDCActuel}
        />
      )}
      {coefficientKChoisi !== undefined ? (
        <div>
          <Heading3 className="m-0">Coefficient K choisi</Heading3>
          <p className="m-0">{coefficientKChoisi ? 'Oui' : 'Non'}</p>
        </div>
      ) : null}
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
  identifiantProjet: IdentifiantProjet.ValueType;
  peutModifier: boolean;
  peutLever: boolean;
};

const GarantiesFinancièresProjet = ({
  garantiesFinancières,
  identifiantProjet,
  peutModifier,
  peutLever,
}: GarantiesFinancièresProjetProps) => {
  const motifDemandeGarantiesFinancières =
    garantiesFinancières.motifGfEnAttente &&
    getMotifGFEnAttente(garantiesFinancières.motifGfEnAttente);

  return (
    <div>
      <Heading3 className="m-0">Garanties financières</Heading3>
      {motifDemandeGarantiesFinancières && (
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
          <Link href={Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}>
            voir le détail
          </Link>
          ).
        </AlertMessage>
      )}

      <Link href={Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}>
        {match({ peutModifier, peutLever })
          .with(
            { peutModifier: true, peutLever: true },
            () => 'Consulter, modifier ou lever les documents',
          )
          .with(
            { peutModifier: true, peutLever: false },
            () => 'Consulter ou modifier les documents',
          )
          .otherwise(() => 'Consulter les documents')}
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
