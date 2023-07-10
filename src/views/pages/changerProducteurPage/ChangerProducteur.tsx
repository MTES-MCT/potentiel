import React from 'react';
import { ProjectAppelOffre } from '@entities';
import { Request } from 'express';

import {
  ProjectInfo,
  PrimaryButton,
  FormulaireChampsObligatoireLégende,
  Label,
  SecondaryLinkButton,
  Astérisque,
  Input,
  TextArea,
  AlertBox,
  InfoBox,
  ChoisirCahierDesChargesFormulaire,
  InfoLienGuideUtilisationCDC,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  Heading1,
  ProjectProps,
  Form,
} from '@components';
import { hydrateOnClient } from '../../helpers';
import routes from '@routes';

type ChangerProducteurProps = {
  request: Request;
  project: ProjectProps & { cahierDesChargesActuel: string };
  appelOffre: ProjectAppelOffre;
};

export const ChangerProducteur = ({ request, project, appelOffre }: ChangerProducteurProps) => {
  const { error, success, justification } = (request.query as any) || {};

  const isEolien = appelOffre?.type === 'eolien';

  const doitChoisirCahierDesCharges =
    appelOffre.choisirNouveauCahierDesCharges && project.cahierDesChargesActuel === 'initial';

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-requests">
      <Heading1 className="mb-10">Je signale un changement de producteur</Heading1>

      {doitChoisirCahierDesCharges ? (
        <ChoisirCahierDesChargesFormulaire
          {...{
            projet: {
              id: project.id,
              appelOffre,
              cahierDesChargesActuel: 'initial',
              identifiantGestionnaireRéseau: project.identifiantGestionnaire,
            },
            redirectUrl: routes.GET_CHANGER_PRODUCTEUR(project.id),
            type: 'producteur',
            infoBox: (
              <InfoBox
                title="Afin d'accéder au formulaire de changement de fournisseur, vous devez d'abord changer le
                  cahier des charges à appliquer"
                className="mb-5"
              >
                <InfoLienGuideUtilisationCDC />
              </InfoBox>
            ),
          }}
        />
      ) : (
        <Form
          action={routes.POST_CHANGER_PRODUCTEUR}
          method="post"
          encType="multipart/form-data"
          className="mx-auto"
        >
          <input type="hidden" name="projetId" value={project.id} />
          {success && <SuccessBox title={success} />}
          {error && <ErrorBox title={error} />}

          <FormulaireChampsObligatoireLégende className="text-right" />
          <div>
            <div className="mb-2">Concernant le projet:</div>
            <ProjectInfo project={project} />
          </div>
          <AlertBox title="Attention : révocation des droits sur le projet">
            Une fois ce formulaire de changement de producteur envoyé, vous ne pourrez plus suivre
            ce projet sur Potentiel. Tous les accès actuels seront retirés.
            <br />
            <span className="font-medium">
              Le nouveau producteur pourra retrouver le projet dans les "projets à réclamer"
            </span>
            .
          </AlertBox>
          {isEolien && (
            <ErrorBox
              title="Vous ne pouvez pas changer de producteur avant la date d'achèvement de ce
                      projet."
            />
          )}
          <p>Ancien producteur : {project.nomCandidat}</p>
          <div>
            <Label htmlFor="producteur">
              Nouveau producteur <Astérisque />
            </Label>
            <Input
              type="text"
              name="producteur"
              id="producteur"
              required
              {...(isEolien && { disabled: true })}
            />
          </div>
          <div>
            <Label htmlFor="file">Joindre les statuts mis à jour</Label>
            <Input type="file" name="file" id="file" {...(isEolien && { disabled: true })} />
          </div>
          <div>
            <Label htmlFor="justification">
              Veuillez nous indiquer les raisons qui motivent votre demande
              <br />
              <span className="italic">
                Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant
                conduit à ce besoin de modification (contexte, facteurs extérieurs, etc).
              </span>
            </Label>
            <TextArea
              name="justification"
              id="justification"
              defaultValue={justification || ''}
              {...(isEolien && { disabled: true })}
            />
          </div>
          <div className="mx-auto flex flex-col md:flex-row gap-4 items-center">
            <PrimaryButton type="submit" id="submit">
              Envoyer
            </PrimaryButton>
            <SecondaryLinkButton href={routes.LISTE_PROJETS}>Annuler</SecondaryLinkButton>
          </div>
        </Form>
      )}
    </LegacyPageTemplate>
  );
};

hydrateOnClient(ChangerProducteur);
