'use client';

import React, { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { InputDate } from '@/components/atoms/form/InputDate';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import { GestionnaireRéseauSelect } from '../modifierGestionnaireRéseauRaccordement/GestionnaireRéseauSelect';
import {
  InformationDemandeComplèteRaccordement,
  InformationDemandeComplèteRaccordementProps,
} from '../../InformationDemandeComplèteRaccordement';

import { modifierDemandeComplèteRaccordementAction } from './modifierDemandeComplèteRaccordement.action';

export type ModifierDemandeComplèteRaccordementPageProps = {
  projet: ProjetBannerProps;
  raccordement: {
    référence: string;
    demandeComplèteRaccordement: {
      dateQualification?: Iso8601DateTime;
      accuséRéception?: string;
    };
    canEditRéférence: boolean;
  };
  gestionnaireRéseauActuel: {
    identifiantGestionnaireRéseau: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement?: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
  };
  delaiDemandeDeRaccordementEnMois: InformationDemandeComplèteRaccordementProps['delaiDemandeDeRaccordementEnMois'];
};

export const ModifierDemandeComplèteRaccordementPage: FC<
  ModifierDemandeComplèteRaccordementPageProps
> = ({
  projet,
  raccordement: {
    référence,
    canEditRéférence,
    demandeComplèteRaccordement: { accuséRéception, dateQualification },
  },
  gestionnaireRéseauActuel,
  delaiDemandeDeRaccordementEnMois,
}) => {
  const router = useRouter();

  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  const { identifiantProjet } = projet;
  const { aideSaisieRéférenceDossierRaccordement, identifiantGestionnaireRéseau } =
    gestionnaireRéseauActuel;
  return (
    <ColumnPageTemplate
      banner={<ProjetBanner {...projet} />}
      heading={<TitrePageRaccordement />}
      leftColumn={{
        children: (
          <Form
            method="POST"
            encType="multipart/form-data"
            action={modifierDemandeComplèteRaccordementAction}
            heading="Modifier une demande complète de raccordement"
            onSuccess={() => router.push(Routes.Raccordement.détail(projet.identifiantProjet))}
            onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
          >
            <input name="identifiantProjet" type="hidden" value={identifiantProjet} />
            <input name="referenceDossierRaccordementActuelle" type="hidden" value={référence} />

            <GestionnaireRéseauSelect
              id="identifiantGestionnaireReseau"
              name="identifiantGestionnaireReseau"
              disabled
              identifiantGestionnaireRéseauActuel={identifiantGestionnaireRéseau}
              gestionnairesRéseau={[gestionnaireRéseauActuel]}
              state={
                validationErrors.includes('identifiantGestionnaireReseau') ? 'error' : 'default'
              }
            />

            <Input
              id="referenceDossierRaccordement"
              label="Référence du dossier de raccordement du projet *"
              hintText={
                aideSaisieRéférenceDossierRaccordement && (
                  <>
                    {aideSaisieRéférenceDossierRaccordement.format !== '' && (
                      <div className="m-0">
                        Format attendu : {aideSaisieRéférenceDossierRaccordement.légende}
                      </div>
                    )}
                    {aideSaisieRéférenceDossierRaccordement.légende !== '' && (
                      <div className="m-0 italic">
                        Exemple : {aideSaisieRéférenceDossierRaccordement.format}
                      </div>
                    )}
                  </>
                )
              }
              state={
                validationErrors.includes('referenceDossierRaccordement') ? 'error' : 'default'
              }
              nativeInputProps={{
                type: 'text',
                name: 'referenceDossierRaccordement',
                placeholder: aideSaisieRéférenceDossierRaccordement?.format
                  ? `Exemple: ${aideSaisieRéférenceDossierRaccordement?.format}`
                  : `Renseigner l'identifiant`,
                required: true,
                readOnly: !canEditRéférence,
                defaultValue: référence ?? '',
                pattern: aideSaisieRéférenceDossierRaccordement?.expressionReguliere || undefined,
              }}
            />

            <Upload
              label={
                <>
                  Accusé de réception de la demande complète de raccordement **{' '}
                  {accuséRéception && (
                    <>
                      <br />
                      <small>
                        Pour que la modification puisse fonctionner, merci de joindre un nouveau
                        fichier ou{' '}
                        <Link href={Routes.Document.télécharger(accuséRéception)} target="_blank">
                          celui préalablement transmis
                        </Link>
                      </small>
                    </>
                  )}
                </>
              }
              hint="Format accepté : pdf"
              nativeInputProps={{
                name: 'accuseReception',
                accept: '.pdf',
                required: true,
                'aria-required': true,
              }}
              state={validationErrors.includes('accuseReception') ? 'error' : 'default'}
              stateRelatedMessage="Accusé de réception de la demande complète de raccordement obligatoire"
            />

            <InputDate
              id="dateQualification"
              state={validationErrors.includes('dateQualification') ? 'error' : 'default'}
              label="Date de l'accusé de réception"
              nativeInputProps={{
                type: 'date',
                name: 'dateQualification',
                max: now(),
                defaultValue: dateQualification,
                required: true,
              }}
            />

            <div className="flex flex-col md:flex-row gap-4 m-auto">
              <Button
                priority="secondary"
                linkProps={{
                  href: Routes.Raccordement.détail(identifiantProjet),
                }}
                iconId="fr-icon-arrow-left-line"
              >
                Retour aux dossiers de raccordement
              </Button>
              <SubmitButton>Modifier</SubmitButton>
            </div>
          </Form>
        ),
      }}
      rightColumn={{
        children: (
          <Alert
            severity="info"
            small
            description={
              <div className="py-4 text-justify">
                <InformationDemandeComplèteRaccordement
                  delaiDemandeDeRaccordementEnMois={delaiDemandeDeRaccordementEnMois}
                />
              </div>
            }
          />
        ),
      }}
    />
  );
};
