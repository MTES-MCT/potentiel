'use client';

import React, { FC } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Download from '@codegouvfr/react-dsfr/Download';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-libraries/routes';

import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { formatDateForInput } from '@/utils/formatDateForInput';

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancieres';
import { GarantiesFinancières } from '../TypeGarantiesFinancièresSelect';

export type DétailsGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
  garantiesFinancieres: GarantiesFinancières;
};

export const DétailsGarantiesFinancièresPage: FC<DétailsGarantiesFinancièresProps> = ({
  projet,
  garantiesFinancieres,
}) => (
  <ColumnPageTemplate
    banner={<ProjetBanner {...projet} />}
    heading={<TitrePageGarantiesFinancières />}
    leftColumn={{
      className: 'flex-col gap-4',
      children: (
        <>
          <Input
            label="Type de garanties financières"
            nativeInputProps={{
              type: 'text',
              value: garantiesFinancieres.type,
              readOnly: true,
              'aria-readonly': true,
            }}
          />

          {garantiesFinancieres.type === 'avec date d’échéance' &&
            garantiesFinancieres.dateÉchéance && (
              <Input
                label="Date d'échéance"
                nativeInputProps={{
                  type: 'date',
                  value: formatDateForInput(garantiesFinancieres.dateÉchéance),
                  readOnly: true,
                  'aria-readonly': true,
                }}
              />
            )}

          <Input
            label="Date de constitution"
            nativeInputProps={{
              type: 'date',
              value: formatDateForInput(garantiesFinancieres.dateConsitution),
              readOnly: true,
              'aria-readonly': true,
            }}
          />

          <Download
            label="Attestation de constitution"
            details="Consulter l'attestation de constitution transmise"
            linkProps={{
              href: Routes.Document.télécharger(garantiesFinancieres.attestationConstitution),
              target: '_blank',
            }}
          />

          <div className="flex flex-col md:flex-row gap-4 mt-5">
            <Button
              priority="secondary"
              linkProps={{
                href: Routes.Projet.details(projet.identifiantProjet),
              }}
              iconId="fr-icon-arrow-left-line"
            >
              Retour au détail du projet
            </Button>
          </div>
        </>
      ),
    }}
    rightColumn={{
      children: <></>,
    }}
  />
);
