'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@codegouvfr/react-dsfr/Input';
import Button from '@codegouvfr/react-dsfr/Button';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import Link from 'next/link';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-libraries/routes';

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

import { ValiderDépôtEnCoursGarantiesFinancières } from './valider/validerDépôtEnCoursGarantiesFinancières';
import { RejeterDépôtEnCoursGarantiesFinancières } from './rejeter/RejeterDépôtEnCoursGarantiesFinancières';
import { modifierGarantiesFinancièresÀTraiterAction } from './modifierDépôtEnCoursGarantiesFinancières.action';
import { SupprimerDépôtEnCoursGarantiesFinancières } from './supprimer/SupprimerDépôtEnCoursGarantiesFinancières';

type AvailableActions = Array<'valider' | 'rejeter' | 'supprimer'>;

export type ModifierDépôtEnCoursGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
  typesGarantiesFinancières: TypeGarantiesFinancièresSelectProps['typesGarantiesFinancières'];
  dépôtEnCours: {
    type: TypeGarantiesFinancièresSelectProps['typeGarantiesFinancièresActuel'];
    dateÉchéance?: string;
    dateConsitution: string;
    soumisLe: string;
    attestation: string;
    dernièreMiseÀJour: {
      date: string;
      par: string;
    };
  };
  showWarning?: true;
  actions: AvailableActions;
};

export const ModifierDépôtEnCoursGarantiesFinancièresPage: FC<
  ModifierDépôtEnCoursGarantiesFinancièresProps
> = ({ projet, typesGarantiesFinancières, dépôtEnCours, showWarning, actions }) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <ColumnPageTemplate
      banner={<ProjetBanner {...projet} />}
      heading={<TitrePageGarantiesFinancières />}
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
                  dépôtEnCours.type as TypeGarantiesFinancièresSelectProps['typeGarantiesFinancièresActuel']
                }
                dateÉchéanceActuelle={
                  dépôtEnCours.type === 'avec-date-échéance' ? dépôtEnCours.dateÉchéance : undefined
                }
              />

              <Input
                label="Date de constitution"
                nativeInputProps={{
                  type: 'date',
                  name: 'dateConstitution',
                  max: formatDateForInput(new Date().toISOString()),
                  defaultValue: formatDateForInput(dépôtEnCours.dateConsitution),
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
                    {dépôtEnCours.attestation && (
                      <>
                        <br />
                        <small>
                          Pour que la modification puisse fonctionner, merci de joindre un nouveau
                          fichier ou{' '}
                          <Link
                            href={Routes.Document.télécharger(dépôtEnCours.attestation)}
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
        <ValiderDépôtEnCoursGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('rejeter') && (
        <RejeterDépôtEnCoursGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('supprimer') && (
        <SupprimerDépôtEnCoursGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
    </>
  ) : null;
};
