import React, { useState } from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  Button,
  ErrorBox,
  ExternalLink,
  Heading1,
  Heading2,
  InfoBox,
  Input,
  Label,
  PlugIcon,
  Select,
  Link,
  PageProjetTemplate,
} from '@components';
import { hydrateOnClient } from '../../helpers';
import { GestionnaireRéseauReadModel, RésuméProjetReadModel } from '@potentiel/domain';
import routes from '@routes';

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
  const gestionnaireRéseauActuel = gestionnairesRéseau?.find(
    (gestionnaire) => gestionnaire.codeEIC === identifiantGestionnaire,
  );

  const [format, setFormat] = useState(
    gestionnaireRéseauActuel
      ? gestionnaireRéseauActuel.aideSaisieRéférenceDossierRaccordement.format
      : '',
  );
  const [légende, setLégende] = useState(
    gestionnaireRéseauActuel
      ? gestionnaireRéseauActuel.aideSaisieRéférenceDossierRaccordement.légende
      : '',
  );

  const handleGestionnaireSéléctionné = (codeEIC: string) => {
    const gestionnaireSélectionné = gestionnairesRéseau?.find(
      (gestionnaire) => gestionnaire.codeEIC === codeEIC,
    );
    setFormat(gestionnaireSélectionné?.aideSaisieRéférenceDossierRaccordement.format || '');
    setLégende(gestionnaireSélectionné?.aideSaisieRéférenceDossierRaccordement.légende || '');
  };

  return (
    <PageProjetTemplate user={user} résuméProjet={résuméProjet}>
      <Heading1 className="mb-6">
        <PlugIcon className="mr-1" />
        Raccordement
      </Heading1>

      <div className="flex flex-col md:flex-row gap-4">
        <form
          className="flex gap-3 flex-col max-w-none w-full md:w-1/2 mx-0"
          method="POST"
          encType="multipart/form-data"
          action={routes.POST_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT(identifiantProjet)}
        >
          {error && <ErrorBox>{error}</ErrorBox>}

          <Heading2>Transmettre une demande complète de raccordement</Heading2>

          <p className="text-sm italic m-0">Tous les champs sont obligatoires</p>

          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="codeEIC">Gestionnaire de réseau</Label>
              {identifiantGestionnaire ? (
                <>
                  <Input
                    type="hidden"
                    id="codeEIC"
                    name="codeEIC"
                    value={identifiantGestionnaire}
                  />
                  <Input type="text" value={gestionnaireRéseauActuel?.raisonSociale} disabled />
                </>
              ) : (
                <Select
                  id="codeEIC"
                  name="codeEIC"
                  onChange={(e) => handleGestionnaireSéléctionné(e.currentTarget.value)}
                  defaultValue={'none'}
                >
                  <option value="none" disabled hidden>
                    Sélectionnez votre gestionnaire de réseau
                  </option>
                  {gestionnairesRéseau.map(({ codeEIC, raisonSociale }) => (
                    <option value={codeEIC} key={codeEIC}>
                      {raisonSociale} (code EIC : {codeEIC})
                    </option>
                  ))}
                </Select>
              )}
            </div>

            <div>
              <Label htmlFor="referenceDossierRaccordement">
                Référence du dossier de raccordement du projet *
              </Label>
              {(format || légende) && (
                <InfoBox className="mt-2 mb-3">
                  {légende && <p className="m-0">Format attendu : {légende}</p>}
                  {format && <p className="m-0 italic">Exemple : {format}</p>}
                </InfoBox>
              )}
              <Input
                type="text"
                id="referenceDossierRaccordement"
                name="referenceDossierRaccordement"
                placeholder={format ? `Exemple: ${format}` : `Renseigner l'identifiant`}
                required
              />
            </div>

            <div>
              <Label htmlFor="file">
                Accusé de réception de la demande complète de raccordement
              </Label>
              <Input type="file" id="file" name="file" required />
            </div>

            <div>
              <Label htmlFor="dateQualification">Date de qualification</Label>
              <Input type="date" id="dateQualification" name="dateQualification" required />
            </div>

            <div className="flex flex-col md:flex-row gap-4 m-auto">
              <Button type="submit">Transmettre</Button>
              <Link href={routes.PROJECT_DETAILS(identifiantProjet)} className="m-auto">
                Retour vers le projet
              </Link>
            </div>
          </div>
        </form>

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

hydrateOnClient(TransmettreDemandeComplèteRaccordement);
