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
} from '@components';
import { format as formatDate } from 'date-fns';
import { hydrateOnClient } from '../../../helpers';
import { GestionnaireRéseauReadModel, RésuméProjetReadModel } from '@potentiel/domain';
import routes from '@routes';
import { SaisieRéférenceDossierRaccordement } from './components/SaisieRéférenceDossierRaccordement';
import { GestionnaireRéseauSelect } from '../components/GestionnaireRéseauSelect';

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
  gestionnaireRéseauActuel,
  existingFile,
}: ModifierDemandeComplèteRaccordementProps) => {
  const {
    aideSaisieRéférenceDossierRaccordement: { format, légende },
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
      résuméProjet={résuméProjet}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <Form
          className="flex gap-3 flex-col max-w-none w-full md:w-1/2 mx-0"
          method="POST"
          encType="multipart/form-data"
          action={routes.POST_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT(identifiantProjet, reference)}
        >
          {error && <ErrorBox>{error}</ErrorBox>}

          <Heading2>Modifier une demande complète de raccordement</Heading2>

          {/* <Callout className="text-sm px-3 pt-1 pb-0">
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
          </Callout> */}

          <p className="text-sm italic m-0">Tous les champs sont obligatoires</p>

          <div>
            <Label htmlFor="codeEIC">Gestionnaire de réseau</Label>
            <GestionnaireRéseauSelect
              id="codeEIC"
              name="codeEIC"
              disabled
              gestionnaireRéseauActuel={gestionnaireRéseauActuel}
              gestionnairesRéseau={[gestionnaireRéseauActuel]}
            />
          </div>

          <SaisieRéférenceDossierRaccordement
            format={format}
            légende={légende}
            référenceActuelle={reference}
          />

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
              value={
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
