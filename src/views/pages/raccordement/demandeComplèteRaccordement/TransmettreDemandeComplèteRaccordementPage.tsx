import React, { useState } from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  PrimaryButton,
  ErrorBox,
  ExternalLink,
  Heading2,
  InfoBox,
  Input,
  Label,
  PlugIcon,
  Link,
  PageProjetTemplate,
  Form,
  LabelDescription,
} from '@components';
import { GestionnaireRéseauReadModel, RésuméProjetReadModel } from '@potentiel/domain';
import routes from '@routes';

import { hydrateOnClient } from '../../../helpers';
import { GestionnaireRéseauSelect } from '../components/GestionnaireRéseauSelect';

type TransmettreDemandeComplèteRaccordementProps = {
  identifiantProjet: string;
  user: UtilisateurReadModel;
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
  résuméProjet: RésuméProjetReadModel;
  error?: string;
  identifiantGestionnaire?: string;
};

export const TransmettreDemandeComplèteRaccordement = ({
  user,
  gestionnairesRéseau,
  identifiantProjet,
  résuméProjet,
  error,
  identifiantGestionnaire,
}: TransmettreDemandeComplèteRaccordementProps) => {
  const gestionnaireRéseauActuel = gestionnairesRéseau.find(
    (gestionnaire) => gestionnaire.codeEIC === identifiantGestionnaire,
  );

  const [format, setFormat] = useState(
    gestionnaireRéseauActuel?.aideSaisieRéférenceDossierRaccordement.format ?? '',
  );
  const [légende, setLégende] = useState(
    gestionnaireRéseauActuel?.aideSaisieRéférenceDossierRaccordement.légende ?? '',
  );

  return (
    <PageProjetTemplate
      titre={
        <>
          <PlugIcon className="mr-1" />
          Raccordement
        </>
      }
      user={user}
      résuméProjet={résuméProjet}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <Form
          className="max-w-none w-full md:w-1/2 mx-0"
          method="POST"
          encType="multipart/form-data"
          action={routes.POST_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT(identifiantProjet)}
        >
          {error && <ErrorBox>{error}</ErrorBox>}

          <Heading2>Transmettre une demande complète de raccordement</Heading2>

          <p className="text-sm italic m-0">Tous les champs sont obligatoires</p>

          <div>
            <Label htmlFor="codeEIC">Gestionnaire de réseau</Label>
            <GestionnaireRéseauSelect
              id="codeEIC"
              name="codeEIC"
              disabled={!!gestionnaireRéseauActuel}
              gestionnaireRéseauActuel={gestionnaireRéseauActuel}
              gestionnairesRéseau={gestionnairesRéseau}
              onGestionnaireRéseauSelected={({
                aideSaisieRéférenceDossierRaccordement: { format, légende },
              }) => {
                setFormat(format);
                setLégende(légende);
              }}
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
              className="uppercase"
              type="text"
              id="referenceDossierRaccordement"
              name="referenceDossierRaccordement"
              placeholder={format ? `Exemple: ${format}` : `Renseigner l'identifiant`}
              required
              pattern="[a-zA-Z]{3}-RP-2[0-9]{3}-[\d]{6}"
            />
          </div>

          <div>
            <Label htmlFor="file">Accusé de réception de la demande complète de raccordement</Label>
            <Input type="file" id="file" name="file" required />
          </div>
          <div>
            <Label htmlFor="dateQualification">Date de l'accusé de réception</Label>
            <Input type="date" id="dateQualification" name="dateQualification" required />
          </div>
          <div className="flex flex-col md:flex-row gap-4 m-auto">
            <PrimaryButton type="submit">Transmettre</PrimaryButton>
            {identifiantGestionnaire ? (
              <Link
                href={routes.GET_LISTE_DOSSIERS_RACCORDEMENT(identifiantProjet)}
                className="m-auto"
              >
                Retour vers le dossier de raccordement
              </Link>
            ) : (
              <Link href={routes.PROJECT_DETAILS(identifiantProjet)} className="m-auto">
                Retour vers le projet
              </Link>
            )}
          </div>
        </Form>

        <InfoBox
          className="flex md:w-1/3 md:mx-auto"
          title="Où trouver la référence du dossier de raccordement ?"
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

hydrateOnClient(TransmettreDemandeComplèteRaccordement);
