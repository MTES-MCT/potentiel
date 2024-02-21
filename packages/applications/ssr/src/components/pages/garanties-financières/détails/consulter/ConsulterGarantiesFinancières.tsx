import { FC } from 'react';
import Download from '@codegouvfr/react-dsfr/Download';
import Input from '@codegouvfr/react-dsfr/Input';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-libraries/routes';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { formatDateForInput } from '@/utils/formatDateForInput';

import {
  DétailsGarantiesFinancièresProps,
  GarantiesFinancières,
} from '../DétailsGarantiesFinancières.page';
import { TitrePageGarantiesFinancières } from '../../TitrePageGarantiesFinancieres';
import { AccorderGarantiesFinancières } from '../accorder/AccorderGarantiesFinancières';
import { RejeterGarantiesFinancières } from '../rejeter/RejeterGarantiesFinancières';

type AvailableActions = Array<'accorder' | 'rejeter'>;

type ConsulterGarantiesFinancièresProps = {
  projet: DétailsGarantiesFinancièresProps['projet'];
  garantiesFinancieres: GarantiesFinancières;
  actions: AvailableActions;
};
export const ConsulterGarantiesFinancières: FC<ConsulterGarantiesFinancièresProps> = ({
  projet,
  garantiesFinancieres,
  actions,
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

          {garantiesFinancieres.dateÉchéance && (
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
      className: 'flex flex-col w-full md:w-1/4 gap-4',
      children: mapToActionComponents({
        actions,
        identifiantProjet: projet.identifiantProjet,
      }),
    }}
  />
);

type MapToActionsComponentsProps = {
  actions: AvailableActions;
  identifiantProjet: string;
};
const mapToActionComponents = ({ actions, identifiantProjet }: MapToActionsComponentsProps) => {
  return actions.length ? (
    <>
      {actions.includes('accorder') && (
        <AccorderGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('rejeter') && (
        <RejeterGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
    </>
  ) : null;
};
