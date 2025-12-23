import Notice from '@codegouvfr/react-dsfr/Notice';
import { match, P } from 'ts-pattern';

import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { FormattedDate } from '@/components/atoms/FormattedDate';

type GarantiesFinancièresData = {
  actuelles?: PlainType<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel> & {
    dateÉchéance?: DateTime.RawType;
  };
  dépôt?: PlainType<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel> & {
    dateÉchéance?: DateTime.RawType;
  };
  motifGarantiesFinancièresEnAttente?: Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.RawType;
};

type GarantiesFinancièresDétailsProps = {
  garantiesFinancières: GarantiesFinancièresData;
  identifiantProjet: IdentifiantProjet.RawType;
  estAchevé: boolean;
};

export const GarantiesFinancièresDétails = ({
  identifiantProjet,
  garantiesFinancières,
  estAchevé,
}: GarantiesFinancièresDétailsProps) => {
  const { motifGarantiesFinancièresEnAttente, dépôt, actuelles } = garantiesFinancières;
  const motifDemandeGarantiesFinancières =
    motifGarantiesFinancièresEnAttente &&
    getMotifGarantiesFinancièresEnAttente(motifGarantiesFinancièresEnAttente);

  return (
    <>
      {!estAchevé && motifDemandeGarantiesFinancières && (
        <Notice
          description={`Des garanties financières sont en attente pour ce projet (
          ${motifDemandeGarantiesFinancières})`}
          title=""
          severity="info"
          className="print:hidden"
        />
      )}
      {actuelles &&
        (actuelles.garantiesFinancières.type.type === 'exemption' ? (
          <div>Le projet bénéficie d'une exemption de garanties financières.</div>
        ) : (
          <>
            <div>
              <span>
                Le projet dispose actuellement de garanties financières validées
                {actuelles.garantiesFinancières.constitution?.date && (
                  <span>
                    , constituées le{' '}
                    <FormattedDate date={actuelles.garantiesFinancières.constitution.date.date} />
                  </span>
                )}
                {actuelles.garantiesFinancières.type.type !== 'type-inconnu' && (
                  <span>
                    , {getGarantiesFinancièresLabel(actuelles.garantiesFinancières.type.type)}
                  </span>
                )}
                {actuelles.dateÉchéance && (
                  <span>
                    {' '}
                    au <FormattedDate date={actuelles.dateÉchéance} />
                  </span>
                )}
                .
              </span>
            </div>
            {!actuelles?.document && (
              <Notice
                description="L'attestation de constitution des garanties financières reste à transmettre."
                title=""
                severity="info"
                className="print:hidden"
              />
            )}
            {actuelles.garantiesFinancières.type.type === 'type-inconnu' && (
              <Notice
                description="Le type de garanties financières reste à préciser."
                title=""
                severity="info"
                className="print:hidden"
              />
            )}
          </>
        ))}

      {dépôt && dépôt.garantiesFinancières.constitution && (
        <div>
          De nouvelles garanties financières{' '}
          {getGarantiesFinancièresLabel(dépôt.garantiesFinancières.type.type)}, constituées le{' '}
          <FormattedDate date={dépôt.garantiesFinancières.constitution.date.date} />
          {dépôt.dateÉchéance && (
            <span>
              {' '}
              et avec échéance au <FormattedDate date={dépôt.dateÉchéance} />
            </span>
          )}{' '}
          sont à traiter par l'autorité compétente
        </div>
      )}
      <TertiaryLink href={Routes.GarantiesFinancières.détail(identifiantProjet)}>
        Consulter la page garanties financières
      </TertiaryLink>
    </>
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
