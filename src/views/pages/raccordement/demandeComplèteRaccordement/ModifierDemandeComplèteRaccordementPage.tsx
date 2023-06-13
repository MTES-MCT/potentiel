import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  PrimaryButton,
  ErrorBox,
  Heading2,
  Input,
  Label,
  PlugIcon,
  Link,
  PageProjetTemplate,
  InfoBox,
  ExternalLink,
  Form,
  DownloadLink,
  LabelDescription,
} from '@components';
import { format as formatDate } from 'date-fns';
import { hydrateOnClient } from '../../../helpers';
import { GestionnaireRéseauReadModel, ConsulterProjetReadModel } from '@potentiel/domain-views';
import routes from '@routes';
import { GestionnaireRéseauSelect } from '../components/GestionnaireRéseauSelect';

type ModifierDemandeComplèteRaccordementProps = {
  user: UtilisateurReadModel;
  projet: ConsulterProjetReadModel;
  error?: string;
  reference: string;
  dateQualificationActuelle?: string;
  gestionnaireRéseauActuel: GestionnaireRéseauReadModel;
  existingFile: boolean;
};

export const ModifierDemandeComplèteRaccordement = ({
  user,
  projet,
  error,
  reference,
  dateQualificationActuelle,
  gestionnaireRéseauActuel,
  existingFile,
}: ModifierDemandeComplèteRaccordementProps) => {
  const { identifiantProjet } = projet;
  const {
    aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
  } = gestionnaireRéseauActuel;

  return (
    <PageProjetTemplate
      titre={
        <>
          <PlugIcon className="mr-1" />
          Raccordement
        </>
      }
      user={user}
      résuméProjet={projet}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <Form
          className="max-w-none w-full md:w-1/2 mx-0"
          method="POST"
          encType="multipart/form-data"
          action={routes.POST_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT(identifiantProjet, reference)}
        >
          {error && <ErrorBox>{error}</ErrorBox>}

          <Heading2>Modifier une demande complète de raccordement</Heading2>

          <p className="text-sm italic m-0">Tous les champs sont obligatoires</p>

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
              Référence du dossier de raccordement du projet
              {(format || légende) && (
                <LabelDescription>
                  {légende && <div className="m-0">Format attendu : {légende}</div>}
                  {format && <div className="m-0 italic">Exemple : {format}</div>}
                </LabelDescription>
              )}
            </Label>
            <Input
              type="text"
              id="referenceDossierRaccordement"
              name="referenceDossierRaccordement"
              placeholder={format ? `Exemple: ${format}` : `Renseigner l'identifiant`}
              required
              defaultValue={reference ?? ''}
              pattern={expressionReguliere || undefined}
            />
          </div>

          <div>
            <Label htmlFor="file">Accusé de réception de la demande complète de raccordement</Label>
            <Input type="file" id="file" name="file" required />
            {existingFile && (
              <DownloadLink
                fileUrl={routes.GET_DEMANDE_COMPLETE_RACCORDEMENT_FILE(
                  identifiantProjet,
                  reference,
                )}
              >
                Accusé de réception de la demande complète de raccordement
              </DownloadLink>
            )}
          </div>

          <div>
            <Label htmlFor="dateQualification">Date de l'accusé de réception</Label>
            <Input
              type="date"
              id="dateQualification"
              name="dateQualification"
              defaultValue={
                dateQualificationActuelle
                  ? formatDate(new Date(dateQualificationActuelle), 'yyyy-MM-dd')
                  : ''
              }
              required
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 m-auto">
            <PrimaryButton type="submit">Transmettre</PrimaryButton>
            <Link
              href={routes.GET_LISTE_DOSSIERS_RACCORDEMENT(identifiantProjet)}
              className="m-auto"
            >
              Retour vers le dossier de raccordement
            </Link>
          </div>
        </Form>
        <InfoBox
          className="flex md:w-1/3 md:mx-auto"
          title="* Où trouver la référence du dossier de raccordement ?"
        >
          Vous pouvez retrouver cette donnée sur le courriel d'accusé de réception de votre demande
          complète de raccordement (
          <ExternalLink href="https://docs.potentiel.beta.gouv.fr/gerer-mes-projets-et-documents/comment-transmettre-ma-demande-complete-de-raccordement-dcr">
            Voir un exemple
          </ExternalLink>
          )
        </InfoBox>
      </div>
    </PageProjetTemplate>
  );
};

hydrateOnClient(ModifierDemandeComplèteRaccordement);
