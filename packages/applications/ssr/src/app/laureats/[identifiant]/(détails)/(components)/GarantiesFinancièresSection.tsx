import Notice from '@codegouvfr/react-dsfr/Notice';
import { match, P } from 'ts-pattern';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat, Candidature } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { GetGarantiesFinancièresData } from '../_helpers/getGarantiesFinancièresData';

import { Section } from './Section';

export type GarantiesFinancièresSectionProps = {
  identifiantProjet: string;
  garantiesFinancières: GetGarantiesFinancièresData;
  estAchevé: boolean;
};

export const GarantiesFinancièresSection = ({
  identifiantProjet,
  garantiesFinancières,
  estAchevé,
}: GarantiesFinancièresSectionProps) => {
  const motifDemandeGarantiesFinancières =
    garantiesFinancières.motifGfEnAttente &&
    getMotifGarantiesFinancièresEnAttente(garantiesFinancières.motifGfEnAttente);

  return (
    <Section title="Garanties financières">
      {!estAchevé && motifDemandeGarantiesFinancières && (
        <Notice
          description={`Des garanties financières sont en attente pour ce projet (
          ${motifDemandeGarantiesFinancières})`}
          title=""
          severity="info"
        />
      )}
      {garantiesFinancières.actuelles &&
        (garantiesFinancières.actuelles.type === 'exemption' ? (
          <div>Le projet bénéficie d'une exemption de garanties financières.</div>
        ) : (
          <>
            <div>
              <span>
                Le projet dispose actuellement de garanties financières validées
                {garantiesFinancières.actuelles.dateConstitution && (
                  <span>
                    , constituées le{' '}
                    <FormattedDate date={garantiesFinancières.actuelles.dateConstitution} />
                  </span>
                )}
                {garantiesFinancières.actuelles.type !== 'type-inconnu' && (
                  <span>, {getGarantiesFinancièresLabel(garantiesFinancières.actuelles.type)}</span>
                )}
                {garantiesFinancières.actuelles.dateÉchéance &&
                  garantiesFinancières.actuelles.type === 'avec-date-échéance' && (
                    <span>
                      {' '}
                      au <FormattedDate date={garantiesFinancières.actuelles.dateÉchéance} />
                    </span>
                  )}
                .
              </span>
            </div>
            {!garantiesFinancières.actuelles?.attestation && (
              <Notice
                description="L'attestation de constitution des garanties financières reste à transmettre."
                title=""
                severity="info"
              />
            )}
            {garantiesFinancières.actuelles.type === 'type-inconnu' && (
              <Notice
                description="Le type de garanties financières reste à préciser."
                title=""
                severity="info"
              />
            )}
          </>
        ))}

      {garantiesFinancières.dépôtÀTraiter && (
        <div>
          De nouvelles garanties financières{' '}
          {getGarantiesFinancièresLabel(garantiesFinancières.dépôtÀTraiter?.type)}, constituées le{' '}
          <FormattedDate date={garantiesFinancières.dépôtÀTraiter.dateConstitution} />
          {garantiesFinancières.dépôtÀTraiter.dateÉchéance && (
            <span>
              {' '}
              et avec échéance au{' '}
              <FormattedDate date={garantiesFinancières.dépôtÀTraiter.dateÉchéance} />
            </span>
          )}{' '}
          sont à traiter par l'autorité compétente
        </div>
      )}
      <TertiaryLink href={Routes.GarantiesFinancières.détail(identifiantProjet)}>
        Consulter la page garanties financières
      </TertiaryLink>
    </Section>
  );
};

const getGarantiesFinancièresLabel = (type?: Candidature.TypeGarantiesFinancières.RawType) =>
  match(type)
    .with('consignation', () => 'de type consignation')
    .with('avec-date-échéance', () => "avec date d'échéance")
    .with(
      'six-mois-après-achèvement',
      () => "avec une durée de validité jusqu'à six mois après achèvement du projet",
    )
    .with(P.union('type-inconnu', 'exemption', undefined), () => '')
    .exhaustive();

const getMotifGarantiesFinancièresEnAttente = (
  motif: Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.RawType,
) =>
  match(motif)
    .with('recours-accordé', () => 'recours accordé')
    .with('changement-producteur', () => 'changement de producteur')
    .with(
      'échéance-garanties-financières-actuelles',
      () => 'garanties financières arrivant à échéance',
    )
    .with(P.union('motif-inconnu'), () => '')
    .exhaustive();
