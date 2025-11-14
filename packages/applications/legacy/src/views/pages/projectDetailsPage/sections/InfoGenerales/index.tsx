import React, { ComponentProps } from 'react';
import { ProjectDataForProjectPage } from '../../../../../modules/project';
import { BuildingIcon, Heading3, Link, Section, WarningIcon } from '../../../../components';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../../../helpers/dataToValueTypes';
import { afficherDate } from '../../../../helpers';
import { Routes } from '@potentiel-applications/routes';
import { match } from 'ts-pattern';

import type { Candidature, Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet, DocumentProjet } from '@potentiel-domain/projet';
import { InfoActionnaire } from './InfoActionnaire';
import { InfoPuissance } from './InfoPuissance';
import { InfoRaccordement } from './InfoRaccordement';
import { InfoNatureDeLExploitation } from './InfoNatureDeLExploitation';
import { InfoAttestationConformité } from './InfoAttestationConformité';
import { InfoInstallation } from './InfoInstallation';
import {
  GetActionnaireForProjectPage,
  GetAttestationDeConformitéForProjectPage,
} from '../../../../../controllers/project/getProjectPage/_utils';
import { GetPuissanceForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getPuissance';
import { GetInstallationForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils';
import { GetRaccordementForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getRaccordement';
import { GetNatureDeLExploitationForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils';
import { InfoSiteDeProduction, InfoSiteDeProductionProps } from './InfoSiteDeProduction';
import { getTypeActionnariat } from './helpers/getTypeActionnariat';

export type InfoGeneralesProps = {
  project: ProjectDataForProjectPage;
  role: Role.ValueType;
  raccordement: GetRaccordementForProjectPage;
  demandeRecours: ProjectDataForProjectPage['demandeRecours'];
  garantiesFinancières?: GarantiesFinancièresProjetProps['garantiesFinancières'];
  actionnaire?: GetActionnaireForProjectPage;
  puissance?: GetPuissanceForProjectPage;
  installation?: GetInstallationForProjectPage;
  coefficientKChoisi: boolean | undefined;
  achèvementRéel?: {
    date: number;
    attestationConformité: DocumentProjet.RawType;
    preuveTransmissionAuCocontractant?: DocumentProjet.RawType;
  };
  autorisationDUrbanisme: Candidature.Dépôt.ValueType['autorisationDUrbanisme'];
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
  puissance,
  coefficientKChoisi,
  achèvementRéel,
  autorisationDUrbanisme,
  installation,
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
          estAchevé={!!achèvementRéel}
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
          unitePuissance={unitePuissance}
          désignationCatégorie={désignationCatégorie}
          puissanceInférieurePuissanceMaxVolRéservé={
            appelOffre.periode.noteThresholdBy === 'category' &&
            puissance.puissance < appelOffre.periode.noteThreshold.volumeReserve.puissanceMax
          }
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
      {installation ? <InfoInstallation installation={installation} /> : null}
      {natureDeLExploitation !== undefined ? (
        <InfoNatureDeLExploitation data={natureDeLExploitation} />
      ) : null}
      {actionnaire ? <InfoActionnaire actionnaire={actionnaire} /> : null}
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
      {achèvementRéel && (
        <InfoAttestationConformité
          attestationConformité={achèvementRéel.attestationConformité}
          preuveTransmissionAuCocontractant={achèvementRéel.preuveTransmissionAuCocontractant}
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
