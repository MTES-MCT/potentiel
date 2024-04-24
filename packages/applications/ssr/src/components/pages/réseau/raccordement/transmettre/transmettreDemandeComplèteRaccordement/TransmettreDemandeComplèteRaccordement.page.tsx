'use client';

import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@codegouvfr/react-dsfr/Input';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { Form } from '@/components/atoms/form/Form';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import {
  GestionnaireRéseauSelect,
  GestionnaireRéseauSelectProps,
} from '../../modifier/modifierGestionnaireRéseauRaccordement/GestionnaireRéseauSelect';
import {
  InformationDemandeComplèteRaccordement,
  InformationDemandeComplèteRaccordementProps,
} from '../../InformationDemandeComplèteRaccordement';

import { transmettreDemandeComplèteRaccordementAction } from './transmettreDemandeComplèteRaccordement.action';

export type TransmettreDemandeComplèteRaccordementProps = {
  listeGestionnairesRéseau: GestionnaireRéseauSelectProps['gestionnairesRéseau'];
  identifiantGestionnaireRéseauActuel?: string;
  projet: ProjetBannerProps;
  delaiDemandeDeRaccordementEnMois: InformationDemandeComplèteRaccordementProps['delaiDemandeDeRaccordementEnMois'];
};

export const TransmettreDemandeComplèteRaccordementPage: FC<
  TransmettreDemandeComplèteRaccordementProps
> = ({
  listeGestionnairesRéseau,
  identifiantGestionnaireRéseauActuel,
  projet,
  delaiDemandeDeRaccordementEnMois,
}) => {
  const router = useRouter();

  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  const { identifiantProjet } = projet;
  const gestionnaireActuel = identifiantGestionnaireRéseauActuel
    ? listeGestionnairesRéseau.find(
        (gestionnaire) =>
          gestionnaire.identifiantGestionnaireRéseau === identifiantGestionnaireRéseauActuel,
      )
    : undefined;

  const [format, setFormat] = useState(
    gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement?.format ?? '',
  );
  const [légende, setLégende] = useState(
    gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement?.légende ?? '',
  );
  const [expressionReguliere, setExpressionReguliere] = useState(
    gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement?.expressionReguliere,
  );

  return (
    <ColumnPageTemplate
      banner={<ProjetBanner {...projet} />}
      heading={<TitrePageRaccordement />}
      leftColumn={{
        children: (
          <Form
            method="POST"
            encType="multipart/form-data"
            action={transmettreDemandeComplèteRaccordementAction}
            heading="Transmettre une demande complète de raccordement"
            onSuccess={() => router.push(Routes.Raccordement.détail(projet.identifiantProjet))}
            onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
            buttons={
              <>
                <Button
                  priority="secondary"
                  linkProps={{
                    href: Routes.Raccordement.détail(identifiantProjet),
                  }}
                  iconId="fr-icon-arrow-left-line"
                >
                  Retour aux dossiers de raccordement
                </Button>
                <SubmitButton>Transmettre</SubmitButton>
              </>
            }
          >
            <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

            <GestionnaireRéseauSelect
              id="identifiantGestionnaireReseau"
              name="identifiantGestionnaireReseau"
              label="Gestionnaire de réseau"
              disabled={gestionnaireActuel ? true : undefined}
              identifiantGestionnaireRéseauActuel={identifiantGestionnaireRéseauActuel}
              gestionnairesRéseau={listeGestionnairesRéseau}
              state={
                validationErrors.includes('identifiantGestionnaireRéseau') ? 'error' : 'default'
              }
              onGestionnaireRéseauSelected={({ aideSaisieRéférenceDossierRaccordement }) => {
                setFormat(aideSaisieRéférenceDossierRaccordement?.format || '');
                setLégende(aideSaisieRéférenceDossierRaccordement?.légende || '');
                setExpressionReguliere(
                  aideSaisieRéférenceDossierRaccordement?.expressionReguliere || '',
                );
              }}
            />

            <Input
              label="Référence du dossier de raccordement du projet *"
              hintText={
                <div>
                  {légende && <div>Format attendu : {légende}</div>}
                  {format && <div className="italic">Exemple : {format}</div>}
                </div>
              }
              state={validationErrors.includes('referenceDossier') ? 'error' : 'default'}
              nativeInputProps={{
                name: 'referenceDossier',
                required: true,
                'aria-required': true,
                placeholder: format ? `Exemple: ${format}` : `Renseigner l'identifiant`,
                pattern: expressionReguliere || undefined,
                className: 'uppercase placeholder:capitalize',
              }}
            />

            <Input
              label="Date de l'accusé de réception"
              state={validationErrors.includes('dateQualification') ? 'error' : 'default'}
              nativeInputProps={{
                type: 'date',
                name: 'dateQualification',
                max: new Date().toISOString().split('T').shift(),
                required: true,
                'aria-required': true,
              }}
            />

            <Upload
              label="Accusé de réception de la demande complète de raccordement **"
              hint="Format accepté : pdf"
              nativeInputProps={{
                name: 'accuseReception',
                required: true,
                'aria-required': true,
                accept: '.pdf',
              }}
              state={validationErrors.includes('accuseReception') ? 'error' : 'default'}
              stateRelatedMessage="Accusé de réception de la demande complète de raccordement obligatoire"
            />
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
