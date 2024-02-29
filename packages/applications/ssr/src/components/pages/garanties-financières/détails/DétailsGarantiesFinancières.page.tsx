'use client';

import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Download from '@codegouvfr/react-dsfr/Download';

import { Routes } from '@potentiel-libraries/routes';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { formatDateForInput } from '@/utils/formatDateForInput';

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancières';
import { StatutGarantiesFinancièresBadge } from '../StatutGarantiesFinancièresBadge';

type AvailableActions = Array<'ajouter' | 'modifier' | 'enregistrer'>;

type GarantiesFinancières = {
  type: string;
  dateÉchéance?: string;
  dateConstitution: string;
  validéLe: string;
  attestation: string;
};

export type DétailsGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
  statut: GarantiesFinancières.StatutGarantiesFinancières.RawType;
  garantiesFinancières: {
    validées?: GarantiesFinancières;
    àTraiter?: GarantiesFinancières;
    enAttente?: { dateLimiteSoumission: string; demandéLe: string };
  };
  actions: AvailableActions;
};

export const DétailsGarantiesFinancières: FC<DétailsGarantiesFinancièresProps> = ({
  projet,
  statut,
  garantiesFinancières,
  actions,
}) => (
  <ColumnPageTemplate
    banner={<ProjetBanner {...projet} />}
    heading={
      <TitrePageGarantiesFinancières
        title={
          <>
            Garanties financières <StatutGarantiesFinancièresBadge statut={statut} />
          </>
        }
      />
    }
    leftColumn={{
      children: (
        <>
          {garantiesFinancières.validées && (
            <GarantiesFinancièresInfos garantiesFinancières={garantiesFinancières.validées} />
          )}
          {garantiesFinancières.àTraiter && (
            <GarantiesFinancièresInfos garantiesFinancières={garantiesFinancières.àTraiter} />
          )}
          {garantiesFinancières.enAttente && (
            <ul className="flex flex-col gap-2">
              <li>
                <p>
                  Date limite de soumission :{' '}
                  <span className="font-bold">
                    {formatDateForInput(garantiesFinancières.enAttente.dateLimiteSoumission)}
                  </span>
                </p>
              </li>
              <li>
                <p>
                  Demandé le :{' '}
                  <span className="font-bold">
                    {formatDateForInput(garantiesFinancières.enAttente.demandéLe)}
                  </span>
                </p>
              </li>
            </ul>
          )}
        </>
      ),
    }}
    rightColumn={{
      className: 'flex flex-col w-full md:w-1/3 gap-4',
      children: mapToActionComponents({
        actions,
        identifiantProjet: projet.identifiantProjet,
      }),
    }}
  />
);

type GarantiesFinancièresInfosProps = {
  garantiesFinancières: GarantiesFinancières;
};
const GarantiesFinancièresInfos: FC<GarantiesFinancièresInfosProps> = ({
  garantiesFinancières,
}) => (
  <ul className="flex flex-col gap-2">
    <li>
      <p>
        Type de garanties financières :{' '}
        <span className="font-bold">{garantiesFinancières.type}</span>
      </p>
    </li>
    {garantiesFinancières.dateÉchéance && (
      <li>
        <p>
          Date d'échénace :{' '}
          <span className="font-bold">{formatDateForInput(garantiesFinancières.dateÉchéance)}</span>
        </p>
      </li>
    )}
    <li>
      <p>
        Date de consitution :{' '}
        <span className="font-bold">
          {formatDateForInput(garantiesFinancières.dateConstitution)}
        </span>
      </p>
    </li>
    <li>
      <Download
        label="Attestation de constitution"
        details=""
        linkProps={{
          href: Routes.Document.télécharger(garantiesFinancières.attestation),
        }}
      />
    </li>
  </ul>
);

type MapToActionsComponentsProps = {
  actions: AvailableActions;
  identifiantProjet: string;
};
const mapToActionComponents = ({ actions, identifiantProjet }: MapToActionsComponentsProps) => {
  return actions.length ? (
    <>
      {actions.includes('ajouter') && (
        <Button
          iconId="fr-icon-add-circle-line"
          priority="tertiary no outline"
          linkProps={{
            href: Routes.GarantiesFinancières.soumettre(identifiantProjet),
          }}
        >
          Ajouter des garanties financières
        </Button>
      )}
      {actions.includes('modifier') && (
        <Button
          iconId="fr-icon-pencil-line"
          priority="tertiary no outline"
          linkProps={{
            href: Routes.GarantiesFinancières.modifier(identifiantProjet),
          }}
        >
          Modifier les garanties financières
        </Button>
      )}
      {actions.includes('enregistrer') && (
        <Button
          iconId="fr-icon-add-circle-line"
          priority="tertiary no outline"
          linkProps={{
            /**
             * @todo : add route to register garanties financières
             */
            href: '#',
          }}
        >
          Enregistrer les garanties financières
        </Button>
      )}
    </>
  ) : null;
};
