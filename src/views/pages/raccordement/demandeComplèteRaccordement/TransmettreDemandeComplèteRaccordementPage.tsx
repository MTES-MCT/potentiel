import React, { useState } from 'react';

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
} from '@components';
import { GestionnaireRéseauReadModel, ConsulterProjetReadModel } from '@potentiel/domain-views';
import routes from '@routes';

import { hydrateOnClient } from '../../../helpers';
import { GestionnaireRéseauSelect } from '../components/GestionnaireRéseauSelect';
import { TitrePageRaccordement } from '../components/TitrePageRaccordement';
import {
  InfoBoxFormulaireDCR,
  InfoBoxFormulaireDCRProps,
} from '../components/InfoBoxFormulaireDCR';

type TransmettreDemandeComplèteRaccordementProps = {
  user: UtilisateurReadModel;
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
  projet: ConsulterProjetReadModel;
  delaiDemandeDeRaccordementEnMois: InfoBoxFormulaireDCRProps['delaiDemandeDeRaccordementEnMois'];
  error?: string;
};

export const TransmettreDemandeComplèteRaccordement = ({
  user,
  gestionnairesRéseau,
  projet,
  error,
  delaiDemandeDeRaccordementEnMois,
}: TransmettreDemandeComplèteRaccordementProps) => {
  const { identifiantProjet } = projet;

  const gestionnaireRéseauActuel = gestionnairesRéseau.find(
    (gestionnaire) => gestionnaire.codeEIC === projet.identifiantGestionnaire?.codeEIC,
  );

  const [format, setFormat] = useState(
    gestionnaireRéseauActuel?.aideSaisieRéférenceDossierRaccordement.format ?? '',
  );
  const [légende, setLégende] = useState(
    gestionnaireRéseauActuel?.aideSaisieRéférenceDossierRaccordement.légende ?? '',
  );
  const [expressionReguliere, setExpressionReguliere] = useState(
    gestionnaireRéseauActuel?.aideSaisieRéférenceDossierRaccordement.expressionReguliere,
  );

  return (
    <PageProjetTemplate titre={<TitrePageRaccordement />} user={user} résuméProjet={projet}>
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
            <Label htmlFor="identifiantGestionnaireReseau">Gestionnaire de réseau</Label>
            <GestionnaireRéseauSelect
              id="identifiantGestionnaireReseau"
              name="identifiantGestionnaireReseau"
              disabled={!!gestionnaireRéseauActuel}
              gestionnaireRéseauActuel={gestionnaireRéseauActuel}
              gestionnairesRéseau={gestionnairesRéseau}
              onGestionnaireRéseauSelected={({
                aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
              }) => {
                setFormat(format);
                setLégende(légende);
                setExpressionReguliere(expressionReguliere);
              }}
            />
          </div>

          <div>
            <Label htmlFor="referenceDossierRaccordement">
              Référence du dossier de raccordement du projet *
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
              pattern={expressionReguliere || undefined}
            />
          </div>

          <div>
            <Label htmlFor="file">
              Accusé de réception de la demande complète de raccordement **
            </Label>
            <Input type="file" id="file" name="file" required />
          </div>
          <div>
            <Label htmlFor="dateQualification">Date de l'accusé de réception</Label>
            <Input
              type="date"
              id="dateQualification"
              name="dateQualification"
              max={new Date().toISOString().split('T').shift()}
              required
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 m-auto">
            <PrimaryButton type="submit">Transmettre</PrimaryButton>
            {projet.identifiantGestionnaire ? (
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

        <InfoBoxFormulaireDCR delaiDemandeDeRaccordementEnMois={delaiDemandeDeRaccordementEnMois} />
      </div>
    </PageProjetTemplate>
  );
};

hydrateOnClient(TransmettreDemandeComplèteRaccordement);
