import React, { FC, useState } from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  Badge,
  Button,
  Container,
  ErrorBox,
  ExternalLink,
  Heading1,
  Heading2,
  InfoBox,
  Input,
  Label,
  PlugIcon,
  Select,
  PageTemplate,
} from '@components';
import { hydrateOnClient } from '../../helpers';
import { GestionnaireRéseauReadModel } from '@potentiel/domain';
import routes from '@routes';

type StatutProjetReadModel = 'non-notifié' | 'abandonné' | 'classé' | 'éliminé';

type RésuméProjetReadModel = {
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  statut: StatutProjetReadModel;
  nom: string;
  localité: {
    commune: string;
    département: string;
    région: string;
  };
};

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
      <section className="bg-blue-france-sun-base text-white px-2 md:px-0 py-6 mb-3">
        <Container>
          <RésuméProjet {...résuméProjet} />
        </Container>
      </section>

      <section className="px-2 py-3 md:px-0">
        <Container>
          <Heading1>
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

              <Heading2>Transmettre une demande de raccordement</Heading2>
              <p className="text-sm italic m-0">Tous les champs sont obligatoires</p>
              <div className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="codeEIC">Gestionnaire de réseau</Label>
                  <Select
                    id="codeEIC"
                    name="codeEIC"
                    onChange={(e) => handleGestionnaireSéléctionné(e.currentTarget.value)}
                    defaultValue="none"
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

              <Button type="submit" className="m-auto">
                Transmettre
              </Button>
            </form>

            <InfoBox
              className="flex md:w-1/3 md:mx-auto"
              title="* Où trouver la référence du dossier de raccordement ?"
            >
              Vous pouvez retrouver cette donnée sur le courriel d'accusé de réception de votre
              demande complète de raccordement (
              <ExternalLink href="https://docs.potentiel.beta.gouv.fr/gerer-mes-projets-et-documents/comment-transmettre-ma-demande-complete-de-raccordement-dcr">
                Voir un exemple
              </ExternalLink>
              )
            </InfoBox>
          </div>
        </Container>
      </section>
    </PageTemplate>
  );
};

hydrateOnClient(TransmettreDemandeComplèteRaccordement);

const RésuméProjet: FC<RésuméProjetReadModel> = ({
  appelOffre,
  période,
  famille,
  numéroCRE,
  statut,
  nom,
  localité,
  children,
}) => (
  <div className="w-full py-3 lg:flex justify-between gap-2">
    <div className="mb-3">
      <div
        className="flex justify-start items-center
      "
      >
        <h1 className="mb-0 pb-0 text-white">{nom}</h1>
        <StatutProjet statut={statut} />
      </div>
      <p className="text-sm font-medium p-0 m-0">
        {localité.commune}, {localité.département}, {localité.région}
      </p>
      <div className="text-sm">
        {appelOffre}-{période}
        {famille && `-${famille}`}-{numéroCRE}
      </div>
    </div>
    <div>{children}</div>
  </div>
);

const StatutProjet: FC<{
  statut: StatutProjetReadModel;
}> = ({ statut }) => {
  switch (statut) {
    case 'abandonné':
      return (
        <Badge type="warning" className="ml-2 self-center">
          Abandonné
        </Badge>
      );
    case 'classé':
      return (
        <Badge type="success" className="ml-2 self-center">
          Classé
        </Badge>
      );
    case 'éliminé':
      return (
        <Badge type="error" className="ml-2 self-center">
          Éliminé
        </Badge>
      );
    case 'non-notifié':
      return (
        <Badge type="info" className="ml-2 self-center">
          Non-notifié
        </Badge>
      );
  }
};
