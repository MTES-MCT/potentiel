import Notice from '@codegouvfr/react-dsfr/Notice';
import { match, P } from 'ts-pattern';

import { Routes } from '@potentiel-applications/routes';
import type { DateTime } from '@potentiel-domain/common';
import type { PlainType } from '@potentiel-domain/core';
import type { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

type GarantiesFinancièresData = {
  actuelles?: PlainType<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresActuellesReadModel> & {
    dateÉchéance?: DateTime.RawType;
  };
  dépôt?: PlainType<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel> & {
    dateÉchéance?: DateTime.RawType;
  };
  enAttente?: PlainType<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresEnAttenteReadModel>;
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
  const { dépôt, actuelles, enAttente } = garantiesFinancières;
  const motifGarantiesFinancièresEnAttente =
    enAttente && getMotifGarantiesFinancièresEnAttente(enAttente.motifEnAttente.motif);

  return (
    <>
      {!estAchevé && motifGarantiesFinancièresEnAttente && (
        <Notice
          description={`Des garanties financières sont en attente pour ce projet (${motifGarantiesFinancièresEnAttente})`}
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
              Le projet dispose actuellement de garanties financières{' '}
              <span className="font-semibold">
                {getStatutGarantiesFinancièresLabel(actuelles.statut.statut)}
              </span>
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

      {dépôt?.garantiesFinancières.constitution && (
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

const getStatutGarantiesFinancièresLabel = (
  type: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.RawType,
) =>
  match(type)
    .with('validé', () => 'validées')
    .with('levé', () => 'levées')
    .with('échu', () => 'échues')
    .with('non-déposé', () => 'non déposées')
    .exhaustive();

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
    .with('non-déposé', () => 'garanties financières non déposées')
    .exhaustive();
