import { Request } from 'express';
import React from 'react';
import { ProjectAppelOffre } from '../../../entities';

import routes from '../../../routes';
import {
  AlertBox,
  Callout,
  ChampsObligatoiresLégende,
  ChoisirCahierDesChargesFormulaire,
  ErrorBox,
  Form,
  Heading1,
  Input,
  InputFile,
  Label,
  LabelDescription,
  LegacyPageTemplate,
  PrimaryButton,
  ProjectInfo,
  ProjectProps,
  SecondaryLinkButton,
  SuccessBox,
  TextArea,
} from '../../components';
import { hydrateOnClient } from '../../helpers';

type ChangerProducteurProps = {
  request: Request;
  project: ProjectProps & { cahierDesChargesActuel: string };
  appelOffre: ProjectAppelOffre;
};

export const ChangerProducteur = ({ request, project, appelOffre }: ChangerProducteurProps) => {
  const { error, success, justification } = (request.query as any) || {};

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-requests">
      <Heading1 className="mb-10">Je signale un changement de producteur</Heading1>

      <Form
        action={routes.POST_CHANGER_PRODUCTEUR}
        method="post"
        encType="multipart/form-data"
        className="mx-auto"
      >
        <input type="hidden" name="projetId" value={project.id} />
        {success && <SuccessBox title={success} />}
        {error && <ErrorBox title={error} />}
        <div>
          <div className="mb-2">Concernant le projet:</div>
          <ProjectInfo project={project} />
        </div>
        <AlertBox title="Attention : révocation des droits sur le projet">
          Une fois ce formulaire de changement de producteur envoyé, vous ne pourrez plus suivre ce
          projet sur Potentiel. Tous les accès actuels seront retirés.
          <br />
          <span className="font-medium">
            Le nouveau producteur pourra retrouver le projet dans les "projets à réclamer"
          </span>
          .
        </AlertBox>
        {!appelOffre?.changementProducteurPossibleAvantAchèvement && (
          <ErrorBox
            title="Vous ne pouvez pas changer de producteur avant la date d'achèvement de ce
                      projet."
          />
        )}
        <Callout>
          Producteur actuel : <span className="font-bold">{project.nomCandidat}</span>
        </Callout>

        <ChampsObligatoiresLégende />
        <div>
          <Label htmlFor="producteur">Nouveau producteur</Label>
          <Input
            type="text"
            name="producteur"
            id="producteur"
            {...(!appelOffre?.changementProducteurPossibleAvantAchèvement && { disabled: true })}
            required
            aria-required
          />
        </div>
        <div>
          <Label htmlFor="file">Joindre les statuts mis à jour</Label>
          <InputFile disabled={!appelOffre?.changementProducteurPossibleAvantAchèvement} />
        </div>
        <div>
          <Label htmlFor="justification" optionnel>
            Veuillez nous indiquer les raisons qui motivent votre demande
          </Label>
          <LabelDescription>
            Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant
            conduit à ce besoin de modification (contexte, facteurs extérieurs, etc).
          </LabelDescription>
          <TextArea
            name="justification"
            id="justification"
            defaultValue={justification || ''}
            {...(!appelOffre?.changementProducteurPossibleAvantAchèvement && { disabled: true })}
          />
        </div>
        <div className="mx-auto flex flex-col md:flex-row gap-4 items-center">
          <PrimaryButton type="submit" id="submit">
            Envoyer
          </PrimaryButton>
          <SecondaryLinkButton href={routes.LISTE_PROJETS}>Annuler</SecondaryLinkButton>
        </div>
      </Form>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(ChangerProducteur);
