import Link from 'next/link';
import Notice from '@codegouvfr/react-dsfr/Notice';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat, Candidature } from '@potentiel-domain/projet';

import { FormattedDate } from '../../../../../components/atoms/FormattedDate';
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
                  <span className="font-semibold">
                    , {getGarantiesFinancièresLabel(garantiesFinancières.actuelles.type)}
                  </span>
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
          De{' '}
          <span className="font-semibold">
            nouvelles garanties financières{' '}
            {getGarantiesFinancièresLabel(garantiesFinancières.dépôtÀTraiter?.type)}, constituées le{' '}
            <FormattedDate date={garantiesFinancières.dépôtÀTraiter.dateConstitution} />
            {garantiesFinancières.dépôtÀTraiter.dateÉchéance && (
              <span>
                {' '}
                et avec échéance au{' '}
                <FormattedDate date={garantiesFinancières.dépôtÀTraiter.dateÉchéance} />
              </span>
            )}
          </span>{' '}
          sont à traiter par l'autorité compétente
        </div>
      )}
      <Link className="w-fit" href={Routes.GarantiesFinancières.détail(identifiantProjet)}>
        Consulter la page garanties financières
      </Link>
    </Section>
  );
};

const getGarantiesFinancièresLabel = (type?: Candidature.TypeGarantiesFinancières.RawType) => {
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

const getMotifGarantiesFinancièresEnAttente = (
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
