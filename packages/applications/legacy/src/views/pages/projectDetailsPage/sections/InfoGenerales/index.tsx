import React, { ComponentProps } from 'react';
import { ProjectDataForProjectPage } from '../../../../../modules/project';
import { BuildingIcon, Heading3, Link, Section, WarningIcon } from '../../../../components';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../../../helpers/dataToValueTypes';
import { afficherDate } from '../../../../helpers';
import { Routes } from '@potentiel-applications/routes';
import { match } from 'ts-pattern';

import type { Candidature, Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { InfoActionnaire } from './InfoActionnaire';
import { InfoInstallateur } from './InfoInstallateur';
import { InfoPuissance } from './InfoPuissance';
import { InfoRaccordement } from './InfoRaccordement';
import { InfoInstallationAvecDispositifDeStockage } from './InfoInstallationAvecDispositifDeStockage';
import { InfoNatureDeLExploitation } from './InfoNatureDeLExploitation';
import { InfoAttestationConformité } from './InfoAttestationConformité';
import {
  GetActionnaireForProjectPage,
  GetAttestationDeConformitéForProjectPage,
  GetInstallationAvecDispositifDeStockageForProjectPage,
} from '../../../../../controllers/project/getProjectPage/_utils';
import { GetPuissanceForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getPuissance';
import { GetInstallateurForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils';
import { DocumentProjet } from '@potentiel-domain/document';
import { GetRaccordementForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getRaccordement';
import { GetNatureDeLExploitationForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils';
import { InfoSiteDeProduction, InfoSiteDeProductionProps } from './InfoSiteDeProduction';

export type InfoGeneralesProps = {
  project: ProjectDataForProjectPage;
  role: Role.ValueType;
  raccordement: GetRaccordementForProjectPage;
  demandeRecours: ProjectDataForProjectPage['demandeRecours'];
  garantiesFinancières?: GarantiesFinancièresProjetProps['garantiesFinancières'];
  actionnaire?: GetActionnaireForProjectPage;
  puissance?: GetPuissanceForProjectPage;
  installateur?: GetInstallateurForProjectPage;
  modificationsNonPermisesParLeCDCActuel: boolean;
  coefficientKChoisi: boolean | undefined;
  estAchevé: boolean;
  attestationConformité?: GetAttestationDeConformitéForProjectPage;
  autorisationDUrbanisme: Candidature.Dépôt.ValueType['autorisationDUrbanisme'];
  installationAvecDispositifDeStockage?: GetInstallationAvecDispositifDeStockageForProjectPage;
  natureDeLExploitation?: GetNatureDeLExploitationForProjectPage;
  siteDeProduction: InfoSiteDeProductionProps;
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
    prixReference,
    actionnariat,
    isFinancementParticipatif,
    isInvestissementParticipatif,
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
  autorisationDUrbanisme,
  installateur,
  installationAvecDispositifDeStockage,
  natureDeLExploitation,
  siteDeProduction,
}: InfoGeneralesProps) => {
  const identifiantProjet = formatProjectDataToIdentifiantProjetValueType({
    appelOffreId,
    periodeId,
    familleId,
    numeroCRE,
  });

  const formattedIdentifiantProjet = identifiantProjet.formatter();

  const peutModifierActuelles =
    !!garantiesFinancières?.actuelles &&
    garantiesFinancières.actuelles.type !== 'exemption' &&
    role.aLaPermission('garantiesFinancières.actuelles.modifier');

  const peutModifierDépôt =
    garantiesFinancières?.actuelles?.type !== 'exemption' &&
    role.aLaPermission('garantiesFinancières.dépôt.modifier');

  const peutDemanderMainlevée =
    !!garantiesFinancières?.actuelles &&
    garantiesFinancières.actuelles.type !== 'exemption' &&
    role.aLaPermission('garantiesFinancières.mainlevée.demander');

  const typeActionnariat = getTypeActionnariat({
    actionnariat,
    isFinancementParticipatif,
    isInvestissementParticipatif,
  });

  return (
    <Section title="Informations générales" icon={<BuildingIcon />} className="flex gap-4 flex-col">
      {garantiesFinancières && isClasse && (
        <GarantiesFinancièresProjet
          garantiesFinancières={garantiesFinancières}
          identifiantProjet={identifiantProjet}
          peutModifier={peutModifierActuelles || peutModifierDépôt}
          peutLever={peutDemanderMainlevée}
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

      <InfoSiteDeProduction
        localité={siteDeProduction.localité}
        affichage={siteDeProduction.affichage}
      />

      {autorisationDUrbanisme !== undefined ? (
        <div>
          <Heading3 className="m-0">Autorisation d'urbanisme</Heading3>
          <ul className="list-none m-0 pl-0">
            <li>Numéro : {autorisationDUrbanisme.numéro}</li>
            <li>Date d'obtention : {afficherDate(new Date(autorisationDUrbanisme.date.date))}</li>
          </ul>
        </div>
      ) : null}
      {installateur ? <InfoInstallateur installateur={installateur} /> : null}
      {installationAvecDispositifDeStockage !== undefined ? (
        <InfoInstallationAvecDispositifDeStockage
          installationAvecDispositifDeStockage={installationAvecDispositifDeStockage}
        />
      ) : null}
      {natureDeLExploitation !== undefined ? (
        <InfoNatureDeLExploitation natureDeLExploitation={natureDeLExploitation} />
      ) : null}
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
        <InfoAttestationConformité
          attestationConformité={attestationConformité}
          role={role}
          identifiantProjet={identifiantProjet}
        />
      )}
      {typeActionnariat && (
        <div className="flex flex-col">
          <Heading3 className="m-0">Type d'actionnariat</Heading3>
          <span>{typeActionnariat}</span>
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
      attestation?: DocumentProjet.RawType;
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

      {garantiesFinancières.actuelles &&
        (garantiesFinancières.actuelles.type === 'exemption' ? (
          <div>Le projet bénéficie d'une exemption de garanties financières.</div>
        ) : (
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
            {!garantiesFinancières.actuelles?.attestation && (
              <AlertMessage>
                L'attestation de constitution des garanties financières reste à transmettre.
              </AlertMessage>
            )}
            {garantiesFinancières.actuelles.type === 'type-inconnu' && (
              <AlertMessage>Le type de garanties financières reste à préciser.</AlertMessage>
            )}
          </div>
        ))}

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

type GetTypeActionnariatProps = {
  actionnariat?: ProjectDataForProjectPage['actionnariat'];
  isFinancementParticipatif: ProjectDataForProjectPage['isFinancementParticipatif'];
  isInvestissementParticipatif: ProjectDataForProjectPage['isInvestissementParticipatif'];
};
const getTypeActionnariat = ({
  actionnariat,
  isFinancementParticipatif,
  isInvestissementParticipatif,
}: GetTypeActionnariatProps) => {
  if (actionnariat) {
    if (actionnariat === 'financement-collectif') {
      return 'Financement collectif';
    }
    if (actionnariat === 'gouvernance-partagee') {
      return 'Gouvernance partagée';
    }
  }

  if (isFinancementParticipatif) {
    return 'Financement participatif';
  }

  if (isInvestissementParticipatif) {
    return 'Investissement participatif';
  }

  return undefined;
};
