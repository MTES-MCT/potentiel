import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  PrimaryButton,
  ErrorBox,
  Heading2,
  Input,
  Label,
  Link,
  PageProjetTemplate,
  Form,
  LabelDescription,
  InputFile,
} from '@components';
import { formatDateForInput, hydrateOnClient } from '../../../helpers';
import {
  GestionnaireRéseauReadModel,
  ProjetReadModel,
  DossierRaccordementReadModel,
} from '@potentiel/domain-views';
import routes from '@routes';
import { GestionnaireRéseauSelect } from '../components/GestionnaireRéseauSelect';
import { TitrePageRaccordement } from '../components/TitrePageRaccordement';
import {
  InfoBoxFormulaireDCR,
  InfoBoxFormulaireDCRProps,
} from '../components/InfoBoxFormulaireDCR';

type ModifierDemandeComplèteRaccordementProps = {
  user: UtilisateurReadModel;
  projet: ProjetReadModel;
  dossierRaccordement: DossierRaccordementReadModel;
  error?: string;
  gestionnaireRéseauActuel: GestionnaireRéseauReadModel;
  delaiDemandeDeRaccordementEnMois: InfoBoxFormulaireDCRProps['delaiDemandeDeRaccordementEnMois'];
};

export const ModifierDemandeComplèteRaccordement = ({
  user,
  projet,
  error,
  dossierRaccordement: {
    référence,
    demandeComplèteRaccordement: { dateQualification, accuséRéception },
  },
  gestionnaireRéseauActuel,
  delaiDemandeDeRaccordementEnMois,
}: ModifierDemandeComplèteRaccordementProps) => {
  const { identifiantProjet } = projet;
  const {
    aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
  } = gestionnaireRéseauActuel;

  return (
    <PageProjetTemplate titre={<TitrePageRaccordement />} user={user} résuméProjet={projet}>
      <div className="flex flex-col md:flex-row gap-4">
        <Form
          className="max-w-none w-full md:w-1/2 mx-0"
          method="POST"
          encType="multipart/form-data"
          action={routes.POST_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT(identifiantProjet, référence)}
        >
          <Heading2>Modifier une demande complète de raccordement</Heading2>

          <p className="text-sm italic m-0">
            Sauf mention contraire “(optionnel)” dans le label, tous les champs sont obligatoires
          </p>

          {error && <ErrorBox>{error}</ErrorBox>}

          <div>
            <Label htmlFor="identifiantGestionnaireRéseau">Gestionnaire de réseau</Label>
            <GestionnaireRéseauSelect
              id="identifiantGestionnaireRéseau"
              name="identifiantGestionnaireRéseau"
              disabled
              gestionnaireRéseauActuel={gestionnaireRéseauActuel}
              gestionnairesRéseau={[gestionnaireRéseauActuel]}
            />
          </div>

          <div>
            <Label htmlFor="referenceDossierRaccordement">
              Référence du dossier de raccordement du projet *
            </Label>
            {(format || légende) && (
              <LabelDescription>
                {légende && <div className="m-0">Format attendu : {légende}</div>}
                {format && <div className="m-0 italic">Exemple : {format}</div>}
              </LabelDescription>
            )}
            <Input
              type="text"
              id="referenceDossierRaccordement"
              name="referenceDossierRaccordement"
              placeholder={format ? `Exemple: ${format}` : `Renseigner l'identifiant`}
              required
              defaultValue={référence ?? ''}
              pattern={expressionReguliere || undefined}
            />
          </div>

          <div>
            <Label htmlFor="file">
              Accusé de réception de la demande complète de raccordement **
            </Label>
            <InputFile
              id="file"
              name="file"
              fileUrl={
                accuséRéception?.format
                  ? routes.GET_DEMANDE_COMPLETE_RACCORDEMENT_FILE(identifiantProjet, référence)
                  : undefined
              }
            />
          </div>

          <div>
            <Label htmlFor="dateQualification">Date de l'accusé de réception</Label>
            <Input
              type="date"
              id="dateQualification"
              name="dateQualification"
              defaultValue={dateQualification && formatDateForInput(dateQualification)}
              max={new Date().toISOString().split('T').shift()}
              required
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 m-auto">
            <PrimaryButton type="submit">Modifier</PrimaryButton>
            <Link
              href={routes.GET_LISTE_DOSSIERS_RACCORDEMENT(identifiantProjet)}
              className="m-auto"
            >
              Retour vers le dossier de raccordement
            </Link>
          </div>
        </Form>

        <InfoBoxFormulaireDCR delaiDemandeDeRaccordementEnMois={delaiDemandeDeRaccordementEnMois} />
      </div>
    </PageProjetTemplate>
  );
};

hydrateOnClient(ModifierDemandeComplèteRaccordement);
