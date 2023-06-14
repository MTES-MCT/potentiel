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
  InfoBox,
  ExternalLink,
  Form,
  DownloadLink,
  LabelDescription,
} from '@components';
import { formatDateForInput, hydrateOnClient } from '../../../helpers';
import {
  GestionnaireRéseauReadModel,
  ConsulterProjetReadModel,
  DossierRaccordementReadModel,
} from '@potentiel/domain-views';
import routes from '@routes';
import { GestionnaireRéseauSelect } from '../components/GestionnaireRéseauSelect';
import { TitrePageRaccordement } from '../components/TitrePageRaccordement';

type ModifierDemandeComplèteRaccordementProps = {
  user: UtilisateurReadModel;
  projet: ConsulterProjetReadModel;
  dossierRaccordement: DossierRaccordementReadModel;
  error?: string;
  gestionnaireRéseauActuel: GestionnaireRéseauReadModel;
};

export const ModifierDemandeComplèteRaccordement = ({
  user,
  projet,
  error,
  dossierRaccordement: { référence, dateQualification, accuséRéception },
  gestionnaireRéseauActuel,
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
              defaultValue={référence ?? ''}
              pattern={expressionReguliere || undefined}
            />
          </div>

          <div>
            <Label htmlFor="file">Accusé de réception de la demande complète de raccordement</Label>
            <Input type="file" id="file" name="file" required />
            {accuséRéception?.format && (
              <DownloadLink
                fileUrl={routes.GET_DEMANDE_COMPLETE_RACCORDEMENT_FILE(
                  identifiantProjet,
                  référence,
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
              defaultValue={dateQualification && formatDateForInput(dateQualification)}
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
