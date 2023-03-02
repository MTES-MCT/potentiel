import React, { useState } from 'react';
import { Request } from 'express';

import {
  Button,
  ErrorBox,
  Heading1,
  Heading2,
  InfoBox,
  Input,
  Label,
  PageTemplate,
  ProjectInfo,
  ProjectProps,
  SecondaryLinkButton,
  Select,
  SuccessBox,
} from '@components';
import { hydrateOnClient } from '../../helpers';
import routes from '@routes';

type ModifierIdentifiantGestionnaireReseauProps = {
  request: Request;
  projet: ProjectProps;
  listeGestionnairesRéseau?: {
    codeEIC: string;
    raisonSociale: string;
    format?: string;
    légende?: string;
  }[];
};

export const ModifierIdentifiantGestionnaireReseau = ({
  request,
  projet,
  listeGestionnairesRéseau,
}: ModifierIdentifiantGestionnaireReseauProps) => {
  const { error, success } = (request.query as any) || {};

  const [format, setFormat] = useState('');
  const [légende, setLégende] = useState('');

  const handleGestionnaireSéléctionné = (sélection: React.FormEvent<HTMLSelectElement>) => {
    const gestionnaireSélectionné = listeGestionnairesRéseau?.find(
      (gestionnaire) => gestionnaire.codeEIC === sélection.currentTarget.value,
    );

    gestionnaireSélectionné && gestionnaireSélectionné.format
      ? setFormat(gestionnaireSélectionné.format)
      : setFormat('');

    gestionnaireSélectionné && gestionnaireSélectionné.légende
      ? setLégende(gestionnaireSélectionné.légende)
      : setLégende('');
  };

  return (
    <PageTemplate user={request.user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>
            {projet.identifiantGestionnaire
              ? "Je modifie l'identifiant de gestionnaire réseau"
              : "J'ajoute un identifiant de gestionnaire réseau"}
          </Heading1>
        </div>

        <form
          action={routes.POST_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU}
          method="post"
          className="flex flex-col gap-5"
        >
          {success && <SuccessBox title={success} />}
          {error && <ErrorBox title={error} />}
          <div>
            <Heading2>Concernant le projet</Heading2>
            <ProjectInfo project={projet} className="mb-3" />
          </div>

          <input type="hidden" name="projetId" value={projet.id} />
          {listeGestionnairesRéseau && listeGestionnairesRéseau.length > 0 && (
            <div>
              <Label htmlFor="codeEICGestionnaireRéseau">Gestionnaire de réseau</Label>
              <Select
                id="codeEICGestionnaireRéseau"
                name="codeEICGestionnaireRéseau"
                onChange={(e) => handleGestionnaireSéléctionné(e)}
                defaultValue={projet.gestionnaireRéseau?.codeEIC || ''}
              >
                {!projet.gestionnaireRéseau?.codeEIC && <option selected disabled hidden></option>}
                {listeGestionnairesRéseau.map(({ codeEIC, raisonSociale }) => (
                  <option value={codeEIC} key={codeEIC}>
                    {raisonSociale} (code EIC : {codeEIC})
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="identifiantGestionnaireRéseau">
              Identifiant de gestionnaire réseau du projet (champ obligatoire)
            </Label>
            {(format || légende) && (
              <InfoBox className="mt-2 mb-3">
                {légende && <p className="m-0">Format attendu : {légende}</p>}
                {format && <p className="m-0 italic">Exemple : {format}</p>}
              </InfoBox>
            )}
            <Input
              type="text"
              id="identifiantGestionnaireRéseau"
              name="identifiantGestionnaireRéseau"
              placeholder={format ? `Exemple: ${format}` : `Renseigner l'identifiant`}
              defaultValue={projet.identifiantGestionnaire || ''}
              required
            />
          </div>

          <div className="m-auto flex">
            <Button className="mr-1" type="submit">
              Envoyer
            </Button>
            <SecondaryLinkButton href={routes.PROJECT_DETAILS(projet.id)}>
              Annuler
            </SecondaryLinkButton>
          </div>
        </form>
      </div>
    </PageTemplate>
  );
};
hydrateOnClient(ModifierIdentifiantGestionnaireReseau);
