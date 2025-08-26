import React, { ComponentProps } from 'react';
import { ProjectDataForProjectPage } from '../../../../../modules/project';
import {
  BuildingIcon,
  DownloadLink,
  Heading3,
  Link,
  Section,
  WarningIcon,
} from '../../../../components';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../../../helpers/dataToValueTypes';
import { afficherDate } from '../../../../helpers';
import { Routes } from '@potentiel-applications/routes';
import { match } from 'ts-pattern';

import type { Candidature, Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { InfoActionnaire } from './InfoActionnaire';
import { InfoPuissance } from './InfoPuissance';
import { InfoRaccordement } from './InfoRaccordement';
import { GetActionnaireForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils';
import { GetPuissanceForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getPuissance';
import { DocumentProjet } from '@potentiel-domain/document';
import { GetRaccordementForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getRaccordement';
import { Dépôt } from '@potentiel-domain/projet/dist/candidature';

export type AttestationConformitéProps = {
  date: number;
  attestation: DocumentProjet.RawType;
  preuveTransmissionAuCocontractant: DocumentProjet.RawType;
  identifiantProjet: IdentifiantProjet.RawType;
  permissionModifier: boolean;
};

export type InfoGeneralesProps = {
  project: ProjectDataForProjectPage;
  role: Role.ValueType;
  raccordement: GetRaccordementForProjectPage;
  demandeRecours: ProjectDataForProjectPage['demandeRecours'];
  garantiesFinancières?: GarantiesFinancièresProjetProps['garantiesFinancières'];
  actionnaire?: GetActionnaireForProjectPage;
  puissance?: GetPuissanceForProjectPage;
  modificationsNonPermisesParLeCDCActuel: boolean;
  coefficientKChoisi: boolean | undefined;
  estAchevé: boolean;
  attestationConformité?: AttestationConformitéProps;
  autorisationDUrbanisme: Dépôt.ValueType['autorisationDUrbanisme']
};

export const InfoGenerales = ({
  project: {
    appelOffreId,
    periodeId,
    familleId,
    numeroCRE,
    appelOffre,
    unitePuissance,
    isClasse,
    désignationCatégorie,
    codePostalProjet,
    communeProjet,
    regionProjet,
    departementProjet,
    adresseProjet,
    prixReference,
  },
  raccordement,
  role,
  garantiesFinancières,
  demandeRecours,
  actionnaire,
  modificationsNonPermisesParLeCDCActuel,
  puissance,
  coefficientKChoisi,
  estAchevé,
  attestationConformité,
  autorisationDUrbanisme
}: InfoGeneralesProps) => {
  const identifiantProjet = formatProjectDataToIdentifiantProjetValueType({
    appelOffreId,
    periodeId,
    familleId,
    numeroCRE,
  });

  const formattedIdentifiantProjet = identifiantProjet.formatter();

  return (
    <Section title="Informations générales" icon={<BuildingIcon />} className="flex gap-4 flex-col">
      {garantiesFinancières && isClasse && (
        <GarantiesFinancièresProjet
          garantiesFinancières={garantiesFinancières}
          identifiantProjet={identifiantProjet}
          peutModifier={
            role.aLaPermission('garantiesFinancières.actuelles.modifier') ||
            role.aLaPermission('garantiesFinancières.dépôt.modifier')
          }
          peutLever={role.aLaPermission('garantiesFinancières.mainlevée.demander')}
          estAchevé={estAchevé}
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

      <InfoRaccordement raccordement={raccordement} />
      {puissance !== undefined ? (
        <InfoPuissance
          puissance={puissance}
          modificationsPermisesParLeCDCActuel={!modificationsNonPermisesParLeCDCActuel}
          unitePuissance={unitePuissance}
          désignationCatégorie={désignationCatégorie}
          puissanceInférieurePuissanceMaxVolRéservé={
            appelOffre.periode.noteThresholdBy === 'category' &&
            puissance.puissance < appelOffre.periode.noteThreshold.volumeReserve.puissanceMax
          }
          role={role}
        />
      ) : null}
      <div>
        <Heading3 className="m-0">Site de production</Heading3>
        <div>{adresseProjet}</div>
        <div>
          {codePostalProjet} {communeProjet}
        </div>
        <div>
          {departementProjet}, {regionProjet}
        </div>
      </div>
      {autorisationDUrbanisme !== undefined && (
        <div>
          <Heading3 className="m-0">Autorisation d'urbanisme</Heading3>
          <ul className="list-none m-0 pl-0">
            <li>Numéro : {autorisationDUrbanisme.numéro}</li>
            <li>Date d'obtention : {afficherDate(new Date(autorisationDUrbanisme.date.date))}</li>
          </ul>
        </div>
      )}
      {actionnaire ? (
        <InfoActionnaire
          actionnaire={actionnaire}
          modificationsPermisesParLeCDCActuel={!modificationsNonPermisesParLeCDCActuel}
          role={role}
        />
      ) : null}
      {coefficientKChoisi !== undefined ? (
        <div>
          <Heading3 className="m-0">Coefficient K choisi</Heading3>
          <span>{coefficientKChoisi ? 'Oui' : 'Non'}</span>
        </div>
      ) : null}
      {prixReference && (
        <div>
          <Heading3 className="m-0">Prix</Heading3>
          <span>{prixReference} €/MWh</span>
        </div>
      )}
      {attestationConformité && (
        <div className="flex flex-col">
          <Heading3 className="m-0">Achèvement</Heading3>
          <DownloadLink
            fileUrl={Routes.Document.télécharger(attestationConformité.attestation)}
            className="m-0"
          >
            Télécharger l'attestation de conformité
          </DownloadLink>
          <DownloadLink
            fileUrl={Routes.Document.télécharger(
              attestationConformité.preuveTransmissionAuCocontractant,
            )}
            className="m-0"
          >
            Télécharger la preuve de transmission au cocontractant
          </DownloadLink>
          {role.aLaPermission('achèvement.attestationConformité.modifier') && (
            <Link
              href={Routes.Achèvement.modifierAttestationConformité(identifiantProjet.formatter())}
              aria-label="Modifier les informations d'achèvement du projet"
              className="mt-1"
            >
              Modifier
            </Link>
          )}
        </div>
      )}
    </Section>
  );
};

export type GarantiesFinancièresProjetProps = {
  garantiesFinancières: {
    motifGfEnAttente?: Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.RawType;
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
  estAchevé: boolean;
};

const GarantiesFinancièresProjet = ({
  garantiesFinancières,
  identifiantProjet,
  peutModifier,
  peutLever,
  estAchevé,
}: GarantiesFinancièresProjetProps) => {
  const motifDemandeGarantiesFinancières =
    garantiesFinancières.motifGfEnAttente &&
    getMotifGFEnAttente(garantiesFinancières.motifGfEnAttente);

  return (
    <div className="flex flex-col gap-0">
      <Heading3 className="m-0">Garanties financières</Heading3>
      {!estAchevé && motifDemandeGarantiesFinancières && (
        <AlertMessage>
          Des garanties financières sont en attente pour ce projet (
          {motifDemandeGarantiesFinancières}).
        </AlertMessage>
      )}

      {garantiesFinancières.actuelles && (
        <div>
          <span>
            Le projet dispose actuellement de garanties financières validées
            {garantiesFinancières.actuelles.dateConstitution && (
              <span>
                , constituées le{' '}
                {afficherDate(new Date(garantiesFinancières.actuelles.dateConstitution))}
              </span>
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
          </span>
          {!garantiesFinancières.actuelles?.dateConstitution && (
            <AlertMessage>
              L'attestation de constitution des garanties financières reste à transmettre.
            </AlertMessage>
          )}
          {garantiesFinancières.actuelles.type === 'type-inconnu' && (
            <AlertMessage>Le type de garanties financières reste à préciser.</AlertMessage>
          )}
        </div>
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
  motif?: Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.RawType,
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
