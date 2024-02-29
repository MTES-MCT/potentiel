'use client';

import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Download from '@codegouvfr/react-dsfr/Download';
import Divider from '@mui/material/Divider';
import Link from 'next/link';

import { Routes } from '@potentiel-libraries/routes';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { formatDateForText } from '@/utils/formatDateForText';
import { Heading2 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancières';
import { StatutGarantiesFinancièresBadge } from '../StatutGarantiesFinancièresBadge';
import { getGarantiesFinancièresTypeLabel } from '../getGarantiesFinancièresTypeLabel';

type AvailableActions = Array<'ajouter' | 'modifier' | 'enregistrer'>;

type GarantiesFinancières = {
  type: GarantiesFinancières.TypeGarantiesFinancières.RawType;
  dateÉchéance?: string;
  dateConstitution: string;
  validéLe?: string;
  soumisLe?: string;
  attestation?: string;
  actions: AvailableActions;
};

export type DétailsGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
  statut: GarantiesFinancières.StatutGarantiesFinancières.RawType;
  garantiesFinancières: {
    validées?: GarantiesFinancières;
    àTraiter?: GarantiesFinancières;
    enAttente?: {
      dateLimiteSoumission: string;
      demandéLe: string;
      actions: AvailableActions;
    };
  };
};

export const DétailsGarantiesFinancièresPage: FC<DétailsGarantiesFinancièresProps> = ({
  projet,
  statut,
  garantiesFinancières,
}) => {
  if (
    !garantiesFinancières.validées &&
    !garantiesFinancières.àTraiter &&
    !garantiesFinancières.enAttente
  ) {
    return (
      <PageTemplate banner={<ProjetBanner {...projet} />}>
        <TitrePageGarantiesFinancières title={<>Garanties financières</>} />
        <div className="flex flex-col gap-8">
          <p>
            Aucune garanties financières trouvées pour ce projet, vous pouvez en soumettre une{' '}
            <Link
              href={Routes.GarantiesFinancières.soumettre(projet.identifiantProjet)}
              className="font-semibold"
            >
              nouvelle ici
            </Link>
          </p>
          <Button
            className="mt-5"
            priority="secondary"
            linkProps={{
              href: Routes.Projet.details(projet.identifiantProjet),
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour au détail du projet
          </Button>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate banner={<ProjetBanner {...projet} />}>
      <TitrePageGarantiesFinancières
        title={
          <>
            Garanties financières <StatutGarantiesFinancièresBadge statut={statut} />
          </>
        }
      />

      <div className="flex flex-col mt-10">
        {garantiesFinancières.validées && (
          <>
            <Heading2>Garanties financières validées</Heading2>
            <GarantiesFinancièresInfos
              modificationRoute={Routes.GarantiesFinancières.modifierValidé(
                projet.identifiantProjet,
              )}
              identifiantProjet={projet.identifiantProjet}
              garantiesFinancières={garantiesFinancières.validées}
            />
            {garantiesFinancières.àTraiter && <Divider component="span" className="!mb-8" />}
          </>
        )}

        {garantiesFinancières.àTraiter && (
          <>
            <Heading2>Garanties financières à traiter</Heading2>
            <GarantiesFinancièresInfos
              modificationRoute={Routes.GarantiesFinancières.modifierÀTraiter(
                projet.identifiantProjet,
              )}
              identifiantProjet={projet.identifiantProjet}
              garantiesFinancières={garantiesFinancières.àTraiter}
            />
            {garantiesFinancières.enAttente && <Divider component="span" className="!mb-8" />}
          </>
        )}

        {garantiesFinancières.enAttente && (
          <>
            <Heading2>Garanties financières en attente</Heading2>
            <div className="flex flex-col md:flex-row mt-4">
              <div className={`flex-1`}>
                <ul className="flex flex-col gap-2">
                  <li>
                    <p>
                      Date de la demande :{' '}
                      <span className="font-bold">{garantiesFinancières.enAttente.demandéLe}</span>
                    </p>
                  </li>
                  <li>
                    <p>
                      Date limite de soumission :{' '}
                      <span className="font-bold">
                        {garantiesFinancières.enAttente.dateLimiteSoumission}
                      </span>
                    </p>
                  </li>
                </ul>
              </div>
              <div className={`flex md:max-w-lg`}>
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
              </div>
            </div>
          </>
        )}
      </div>

      <Button
        className="mt-5"
        priority="secondary"
        linkProps={{
          href: Routes.Projet.details(projet.identifiantProjet),
        }}
        iconId="fr-icon-arrow-left-line"
      >
        Retour au détail du projet
      </Button>
    </PageTemplate>
  );
};

type GarantiesFinancièresInfosProps = {
  identifiantProjet: string;
  modificationRoute: string;
  garantiesFinancières: GarantiesFinancières;
};

const GarantiesFinancièresInfos: FC<GarantiesFinancièresInfosProps> = ({
  identifiantProjet,
  modificationRoute,
  garantiesFinancières,
}) => (
  <div className="flex flex-col md:flex-row mt-4">
    <div className={`flex-1`}>
      <ul className="flex flex-col gap-2">
        <li>
          <p>
            Type de garanties financières :{' '}
            <span className="font-bold">
              {getGarantiesFinancièresTypeLabel(garantiesFinancières.type)}
            </span>
          </p>
        </li>
        {garantiesFinancières.dateÉchéance && (
          <li>
            <p>
              Date d'échéance :{' '}
              <span className="font-bold">
                {formatDateForText(garantiesFinancières.dateÉchéance)}
              </span>
            </p>
          </li>
        )}
        <li>
          <p>
            Date de consitution :{' '}
            <span className="font-bold">
              {formatDateForText(garantiesFinancières.dateConstitution)}
            </span>
          </p>
        </li>
        {garantiesFinancières.soumisLe && (
          <li>
            <p>
              Soumis le :{' '}
              <span className="font-bold">{formatDateForText(garantiesFinancières.soumisLe)}</span>
            </p>
          </li>
        )}
        {garantiesFinancières.attestation && (
          <li>
            <Download
              label="Attestation de constitution"
              details=""
              linkProps={{
                href: Routes.Document.télécharger(garantiesFinancières.attestation),
              }}
            />
          </li>
        )}
      </ul>
    </div>
    <div className={`flex flex-col md:max-w-lg`}>
      {garantiesFinancières.actions.includes('modifier') && (
        <Button
          iconId="fr-icon-pencil-line"
          priority="tertiary no outline"
          linkProps={{
            href: modificationRoute,
          }}
        >
          Modifier les garanties financières
        </Button>
      )}
      {garantiesFinancières.actions.includes('ajouter') && (
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

      {garantiesFinancières.actions.includes('enregistrer') && (
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
    </div>
  </div>
);
