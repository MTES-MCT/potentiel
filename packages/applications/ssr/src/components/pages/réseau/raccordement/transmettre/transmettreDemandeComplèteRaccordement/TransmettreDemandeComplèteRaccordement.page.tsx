'use client';

import Alert from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';

import {
  InformationDemandeComplèteRaccordement,
  InformationDemandeComplèteRaccordementProps,
} from '../../InformationDemandeComplèteRaccordement';
import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import {
  GestionnaireRéseauSelect,
  GestionnaireRéseauSelectProps,
} from '../../modifier/modifierGestionnaireRéseauRaccordement/GestionnaireRéseauSelect';

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
  const [selectedIdentifiantGestionnaireRéseau, setSelectedIdentifiantGestionnaireRéseau] =
    useState<string | undefined>(identifiantGestionnaireRéseauActuel);

  const alreadyHasAGestionnaireRéseau =
    identifiantGestionnaireRéseauActuel && identifiantGestionnaireRéseauActuel !== 'inconnu';

  const { identifiantProjet } = projet;

  const gestionnaireActuel = selectedIdentifiantGestionnaireRéseau
    ? listeGestionnairesRéseau.find(
        (gestionnaire) =>
          gestionnaire.identifiantGestionnaireRéseau === selectedIdentifiantGestionnaireRéseau,
      )
    : undefined;
  const format = gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement?.format ?? '';
  const légende = gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement?.légende ?? '';
  const expressionReguliere =
    gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement?.expressionReguliere;

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
          >
            <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

            <GestionnaireRéseauSelect
              id="identifiantGestionnaireReseau"
              name="identifiantGestionnaireReseau"
              label="Gestionnaire de réseau"
              disabled={alreadyHasAGestionnaireRéseau ? true : undefined}
              identifiantGestionnaireRéseauActuel={identifiantGestionnaireRéseauActuel}
              gestionnairesRéseau={listeGestionnairesRéseau}
              state={
                validationErrors.includes('identifiantGestionnaireRéseau') ? 'error' : 'default'
              }
              onGestionnaireRéseauSelected={({ identifiantGestionnaireRéseau }) =>
                setSelectedIdentifiantGestionnaireRéseau(identifiantGestionnaireRéseau)
              }
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

            <UploadDocument
              label="Accusé de réception de la demande complète de raccordement **"
              name="accuseReception"
              required
              state={validationErrors.includes('accuseReception') ? 'error' : 'default'}
              stateRelatedMessage="Accusé de réception de la demande complète de raccordement obligatoire"
            />

            <div className="flex flex-col md:flex-row gap-4 mt-5">
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
