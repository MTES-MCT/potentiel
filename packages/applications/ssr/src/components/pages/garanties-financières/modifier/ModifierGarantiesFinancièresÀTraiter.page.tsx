'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@codegouvfr/react-dsfr/Input';
import Button from '@codegouvfr/react-dsfr/Button';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import Link from 'next/link';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-libraries/routes';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { Form } from '@/components/atoms/form/Form';
import { formatDateForInput } from '@/utils/formatDateForInput';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancières';
import {
  TypeGarantiesFinancièresSelect,
  TypeGarantiesFinancièresSelectProps,
} from '../TypeGarantiesFinancièresSelect';
import { StatutGarantiesFinancièresBadge } from '../StatutGarantiesFinancièresBadge';

import { ValiderGarantiesFinancièresÀTraiter } from './valider/ValiderGarantiesFinancièresÀTraiter';
import { RejeterGarantiesFinancièresÀTraiter } from './rejeter/RejeterGarantiesFinancièresÀTraiter';
import { modifierGarantiesFinancièresÀTraiterAction } from './modifierGarantiesFinancièresÀTraiter.action';
import { SupprimerGarantiesFinancièresÀTraiter } from './supprimer/SupprimerGarantiesFinancièresÀTraiter';

type AvailableActions = Array<'valider' | 'rejeter' | 'supprimer'>;

export type ModifierGarantiesFinancièresÀTraiterProps = {
  projet: ProjetBannerProps;
  typesGarantiesFinancières: TypeGarantiesFinancièresSelectProps['typesGarantiesFinancières'];
  statut: GarantiesFinancières.StatutGarantiesFinancières.RawType;
  garantiesFinancières: {
    type: TypeGarantiesFinancièresSelectProps['typeGarantiesFinancièresActuel'];
    dateÉchéance?: string;
    dateConsitution: string;
    attestation: string;
  };
  showWarning?: true;
  actions: AvailableActions;
};

export const ModifierGarantiesFinancièresÀTraiter: FC<
  ModifierGarantiesFinancièresÀTraiterProps
> = ({ projet, typesGarantiesFinancières, statut, garantiesFinancières, showWarning, actions }) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
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
            <Form
              method="POST"
              encType="multipart/form-data"
              action={modifierGarantiesFinancièresÀTraiterAction}
              onSuccess={() =>
                router.push(Routes.GarantiesFinancières.détail(projet.identifiantProjet))
              }
              onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
            >
              {showWarning && (
                <Alert
                  severity="warning"
                  className="mb-3"
                  title=""
                  description={
                    <>
                      Vous pouvez modifier ou supprimer cette soumission de garanties financières
                      jusqu'à la validation par la DREAL concernée.
                    </>
                  }
                />
              )}

              <TypeGarantiesFinancièresSelect
                id="typeGarantiesFinancieres"
                name="typeGarantiesFinancieres"
                validationErrors={validationErrors}
                typesGarantiesFinancières={typesGarantiesFinancières}
                typeGarantiesFinancièresActuel={
                  garantiesFinancières.type as TypeGarantiesFinancièresSelectProps['typeGarantiesFinancièresActuel']
                }
                dateÉchéanceActuelle={
                  garantiesFinancières.type === 'avec-date-échéance'
                    ? garantiesFinancières.dateÉchéance
                    : undefined
                }
              />

              <Input
                label="Date de constitution"
                nativeInputProps={{
                  type: 'date',
                  name: 'dateConstitution',
                  max: formatDateForInput(new Date().toISOString()),
                  defaultValue: garantiesFinancières.dateConsitution
                    ? formatDateForInput(garantiesFinancières.dateConsitution)
                    : undefined,
                  required: true,
                  'aria-required': true,
                }}
                state={validationErrors.includes('dateConstitution') ? 'error' : 'default'}
                stateRelatedMessage="Date de constitution des garanties financières obligatoire"
              />

              <Upload
                label={
                  <>
                    Attestation de constitution{' '}
                    {garantiesFinancières.attestation && (
                      <>
                        <br />
                        <small>
                          Pour que la modification puisse fonctionner, merci de joindre un nouveau
                          fichier ou{' '}
                          <Link
                            href={Routes.Document.télécharger(garantiesFinancières.attestation)}
                            target="_blank"
                          >
                            celui préalablement transmis
                          </Link>
                        </small>
                      </>
                    )}
                  </>
                }
                hint="Format accepté : pdf"
                nativeInputProps={{
                  name: 'attestationConstitution',
                  required: true,
                  'aria-required': true,
                  accept: '.pdf',
                }}
                state={validationErrors.includes('attestationConstitution') ? 'error' : 'default'}
                stateRelatedMessage="Attestation de consitution des garantières financières obligatoire"
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
                <SubmitButton>Modifier</SubmitButton>
              </div>
            </Form>
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
};

type MapToActionsComponentsProps = {
  actions: AvailableActions;
  identifiantProjet: string;
};
const mapToActionComponents = ({ actions, identifiantProjet }: MapToActionsComponentsProps) => {
  return actions.length ? (
    <>
      {actions.includes('valider') && (
        <ValiderGarantiesFinancièresÀTraiter identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('rejeter') && (
        <RejeterGarantiesFinancièresÀTraiter identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('supprimer') && (
        <SupprimerGarantiesFinancièresÀTraiter identifiantProjet={identifiantProjet} />
      )}
    </>
  ) : null;
};
