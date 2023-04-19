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
  PageTemplate,
  ProjectInfo,
  ProjectProps,
  Select,
} from '@components';
import { hydrateOnClient } from '../../helpers';
import { GestionnaireRéseauReadModel } from '@potentiel/domain';
import routes from '@routes';

type TransmettreDemandeComplèteRaccordementProps = {
  user: UtilisateurReadModel;
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
  projet: ProjectProps;
  error?: string;
  identifiantGestionnaire?: string;
};

export const TransmettreDemandeComplèteRaccordement = ({
  user,
  gestionnairesRéseau,
  projet,
  error,
  identifiantGestionnaire,
}: TransmettreDemandeComplèteRaccordementProps) => {
  const [format, setFormat] = useState('');
  const [légende, setLégende] = useState('');

  const handleGestionnaireSéléctionné = (codeEIC: string) => {
    const gestionnaireSélectionné = gestionnairesRéseau?.find(
      (gestionnaire) => gestionnaire.codeEIC === codeEIC,
    );
    setFormat(gestionnaireSélectionné?.aideSaisieRéférenceDossierRaccordement.format || '');
    setLégende(gestionnaireSélectionné?.aideSaisieRéférenceDossierRaccordement.légende || '');
  };

  return (
    <PageTemplate user={user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Transmettre une demande complète de raccordement</Heading1>
        </div>
        <form
          className="flex gap-3 flex-col"
          method="POST"
          encType="multipart/form-data"
          action={routes.POST_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT(projet.id)}
        >
          {error && <ErrorBox>{error}</ErrorBox>}
          <Heading2>Concernant le projet</Heading2>
          <ProjectInfo project={projet} className="mb-3" />
          <Heading2>Enregistrer un dossier dans Potentiel</Heading2>
          <p className="text-sm italic m-0">Tous les champs sont obligatoires</p>
          <div className="flex flex-col gap-4">
            {gestionnairesRéseau && gestionnairesRéseau.length > 0 && (
              <div>
                <Label htmlFor="codeEIC">Gestionnaire de réseau</Label>
                <Select
                  id="codeEIC"
                  name="codeEIC"
                  onChange={(e) => handleGestionnaireSéléctionné(e.currentTarget.value)}
                  defaultValue={identifiantGestionnaire || 'none'}
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
              </div>
            )}

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
              <p className="mt-4 mb-0 italic">
                * Où trouver la référence du dossier de raccordement ?
                <br />
                Vous pouvez retrouver cette donnée sur le courriel d'accusé de réception de votre
                demande complète de raccordement (
                <ExternalLink href="https://docs.potentiel.beta.gouv.fr/gerer-mes-projets-et-documents/comment-transmettre-ma-demande-complete-de-raccordement-dcr">
                  Voir un exemple
                </ExternalLink>
                )
              </p>
            </div>
          </div>
          <div>
            <Label htmlFor="file">Accusé de réception de la demande complète de raccordement</Label>
            <Input type="file" id="file" name="file" required />
          </div>
          <div>
            <Label htmlFor="dateQualification">Date de qualification</Label>
            <Input type="date" id="dateQualification" name="dateQualification" required />
          </div>
          <Button type="submit" className="m-auto">
            Envoyer
          </Button>
        </form>
      </div>
    </PageTemplate>
  );
};
hydrateOnClient(TransmettreDemandeComplèteRaccordement);
