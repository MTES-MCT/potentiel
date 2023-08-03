import React from 'react';

import { Section, ClipboardCheckIcon, ErrorIcon, LinkButton, DownloadLink } from '@components';
import { User } from '@entities';
import { afficherDate } from '@views/helpers';
import routes from '@routes';

export type GarantiesFinancieresData = {
  typeGarantiesFinancières?: string;
  dateEchéance?: number;
} & (
  | {
      statut: 'en attente' | 'en retard';
      dateLimiteEnvoi?: number;
    }
  | {
      statut: 'validé' | 'à traiter';
      envoyéesPar: User['role'];
      url: string;
      dateConstitution: number;
    }
);

type GarantiesFinancieresProps = GarantiesFinancieresData & { projetId: string };

export const GarantiesFinancieres = (garantiesFinancières: GarantiesFinancieresProps) => {
  const { statut, typeGarantiesFinancières, dateEchéance } = garantiesFinancières;
  const attestationTransmise = statut === 'validé' || statut === 'à traiter';
  const attestationEnEAttente = statut === 'en attente' || statut === 'en retard';
  const donnéesManquantes = !typeGarantiesFinancières || attestationEnEAttente;

  return (
    <Section title="Garanties financières" icon={<ClipboardCheckIcon />}>
      <div className="mb-6">
        {donnéesManquantes && (
          <div>
            <div className="flex flex-row mt-0 mb-3 text-sm text-red-marianne-main-472-base">
              <div>
                <ErrorIcon className="text-lg text-red-marianne-main-472-base mr-2" aria-hidden />
              </div>
              <p className="m-0">données manquantes</p>
            </div>
          </div>
        )}

        <div>
          {typeGarantiesFinancières && <p className="m-0">type : {typeGarantiesFinancières}</p>}
          {dateEchéance && <p className="m-0">date d'échéance : {afficherDate(dateEchéance)}</p>}
          <div>
            {attestationTransmise && (
              <>
                <p className="m-0">
                  date de constutition : {afficherDate(garantiesFinancières.dateConstitution)}
                </p>
                <DownloadLink fileUrl={garantiesFinancières.url}>
                  Télécharger l'attestation
                </DownloadLink>
              </>
            )}
          </div>
        </div>
      </div>
      {attestationEnEAttente && garantiesFinancières.dateLimiteEnvoi && (
        <p>
          Les garanties financières doivent être transmises dans Potentiel avant le{' '}
          {afficherDate(garantiesFinancières.dateLimiteEnvoi)}.
        </p>
      )}
      {!typeGarantiesFinancières && attestationEnEAttente && (
        <LinkButton
          href={routes.GET_TRANSMETTRE_GARANTIES_FINANCIERES_PAGE({
            projectId: garantiesFinancières.projetId,
          })}
        >
          Transmettre les garanties financières
        </LinkButton>
      )}
      {typeGarantiesFinancières && attestationEnEAttente && (
        <LinkButton
          href={routes.GET_TRANSMETTRE_GARANTIES_FINANCIERES_PAGE({
            projectId: garantiesFinancières.projetId,
          })}
        >
          Transmettre l'attestation
        </LinkButton>
      )}
      {!typeGarantiesFinancières && !attestationEnEAttente && (
        <LinkButton
          href={routes.GET_TRANSMETTRE_GARANTIES_FINANCIERES_PAGE({
            projectId: garantiesFinancières.projetId,
          })}
        >
          Renseigner le type de garanties financières
        </LinkButton>
      )}
    </Section>
  );
};
