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
  Callout,
  InfoBox,
  EditIcon,
  DownloadLink,
  ExternalLink,
} from '@components';
import { afficherDate, hydrateOnClient } from '../../helpers';
import { GestionnaireRéseauReadModel, RésuméProjetReadModel } from '@potentiel/domain';
import routes from '@routes';
import { userIs } from '@modules/users';

type ModifierDemandeComplèteRaccordementProps = {
  identifiantProjet: string;
  user: UtilisateurReadModel;
  résuméProjet: RésuméProjetReadModel;
  error?: string;
  reference: string;
  dateQualificationActuelle?: string;
  gestionnaireRéseauActuel: GestionnaireRéseauReadModel;
  existingFile: boolean;
};

export const ModifierDemandeComplèteRaccordement = ({
  user,
  identifiantProjet,
  résuméProjet,
  error,
  reference,
  dateQualificationActuelle,
  gestionnaireRéseauActuel: {
    aideSaisieRéférenceDossierRaccordement: { format, légende },
    raisonSociale,
  },
  existingFile,
}: ModifierDemandeComplèteRaccordementProps) => {
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
        <form
          className="flex gap-3 flex-col max-w-none w-full md:w-1/2 mx-0"
          method="POST"
          encType="multipart/form-data"
          action={routes.POST_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT(identifiantProjet, reference)}
        >
          {error && <ErrorBox>{error}</ErrorBox>}

          <Heading2>Modifier une demande complète de raccordement</Heading2>

          <Callout className="text-sm my-4 px-3 pt-1 pb-0">
            <ul className="list-none p-0">
              <li>
                Gestionnaire de réseau : <span className="font-bold mr-2">{raisonSociale}</span>
                {userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user) && (
                  <Link
                    href={routes.GET_MODIFIER_GESTIONNAIRE_RESEAU_PROJET_PAGE(identifiantProjet)}
                  >
                    <EditIcon className="mr-1" />
                    Modifier le gestionnaire
                  </Link>
                )}
              </li>
              <li className="my-0">
                Référence du dossier de raccordement :{' '}
                <span className="font-bold">{reference}</span>
              </li>
              {dateQualificationActuelle && (
                <li className="my-0">
                  Date de qualification de la demande complète de raccordement :{' '}
                  <span className="font-bold">
                    {afficherDate(new Date(dateQualificationActuelle))}
                  </span>
                </li>
              )}
              {existingFile && (
                <li>
                  <DownloadLink
                    fileUrl={routes.GET_DEMANDE_COMPLETE_RACCORDEMENT_FILE(
                      identifiantProjet,
                      reference,
                    )}
                  >
                    Accusé de réception de la demande complète de raccordement
                  </DownloadLink>
                </li>
              )}
            </ul>
          </Callout>

          <p className="text-sm italic m-0">Tous les champs sont obligatoires</p>

          <div>
            <Label htmlFor="nouvelleReference">
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
              id="nouvelleReference"
              name="nouvelleReference"
              placeholder={format ? `Exemple: ${format}` : `Renseigner l'identifiant`}
              required
            />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="file">
                Accusé de réception de la demande complète de raccordement
              </Label>
              <Input type="file" id="file" name="file" required />
            </div>

            <div>
              <Label htmlFor="dateQualification">Date de l'accusé de réception</Label>
              <Input type="date" id="dateQualification" name="dateQualification" required />
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

hydrateOnClient(ModifierDemandeComplèteRaccordement);
