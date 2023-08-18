import {
  ProjectInfo,
  TextArea,
  Input,
  PrimaryButton,
  SecondaryLinkButton,
  InfoBox,
  ChoisirCahierDesChargesFormulaire,
  InfoLienGuideUtilisationCDC,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  Heading1,
  ProjectProps,
  Label,
  Form,
  Callout,
  ChampsObligatoiresLégende,
  LabelDescription,
} from '../../components';
import routes from '../../../routes';
import { ProjectAppelOffre } from '../../../entities';

import { Request } from 'express';
import React from 'react';
import format from 'date-fns/format';

import { hydrateOnClient } from '../../helpers';

type DemanderDelaiProps = {
  request: Request;
  project: ProjectProps & {
    cahierDesChargesActuel: string;
    completionDueOn: number;
  };
  appelOffre: ProjectAppelOffre;
  validationErrors?: Array<{ [fieldName: string]: string }>;
};

export const DemanderDelai = ({ request, project, appelOffre }: DemanderDelaiProps) => {
  const { error, success, justification, dateAchèvementDemandée } = (request.query as any) || {};

  const doitChoisirCahierDesCharges =
    appelOffre.choisirNouveauCahierDesCharges && project.cahierDesChargesActuel === 'initial';

  const nouvelleDateAchèvementMinimale = new Date(project.completionDueOn).setDate(
    new Date(project.completionDueOn).getDate() + 1,
  );

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-requests">
      <Heading1 className="mb-10">Je demande un délai supplémentaire</Heading1>

      {doitChoisirCahierDesCharges ? (
        <ChoisirCahierDesChargesFormulaire
          projet={{
            id: project.id,
            appelOffre,
            cahierDesChargesActuel: 'initial',
            identifiantGestionnaireRéseau: project.identifiantGestionnaire,
          }}
          redirectUrl={routes.DEMANDER_DELAI(project.id)}
          type="delai"
          infoBox={
            <InfoBox
              title="Afin d'accéder au formulaire de demande de délai, vous devez d'abord changer le
                  cahier des charges à appliquer"
              className="mb-5"
            >
              <InfoLienGuideUtilisationCDC />
            </InfoBox>
          }
        />
      ) : (
        <Form
          action={routes.DEMANDE_DELAI_ACTION}
          method="post"
          encType="multipart/form-data"
          className="mx-auto"
        >
          <input type="hidden" name="projectId" value={project.id} />
          {success && <SuccessBox title={success} />}
          {error && <ErrorBox title={error as string} />}

          <div>
            <div className="mb-1">Concernant le projet:</div>
            <ProjectInfo project={project} />
          </div>
          <Callout>
            Date théorique d'achèvement actuelle :{' '}
            <span className="font-bold">{format(project.completionDueOn, 'dd/MM/yyyy')}</span>
          </Callout>
          <ChampsObligatoiresLégende />
          <div>
            <Label htmlFor="dateAchevementDemandee">
              Saisissez la date limite d'achèvement souhaitée
            </Label>
            <Input
              type="date"
              name="dateAchevementDemandee"
              id="dateAchevementDemandee"
              min={format(nouvelleDateAchèvementMinimale, 'yyyy-MM-dd')}
              defaultValue={dateAchèvementDemandée}
              required
              aria-required="true"
            />
          </div>
          <div>
            <Label htmlFor="justification">
              Veuillez nous indiquer les raisons qui motivent votre demande
            </Label>
            <LabelDescription>
              Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant
              conduit à ce besoin de modification (contexte, facteurs extérieurs, etc.)
            </LabelDescription>
            <TextArea
              name="justification"
              id="justification"
              defaultValue={justification || ''}
              required
              aria-required="true"
            />
          </div>
          <div>
            <Label htmlFor="file">Pièce justificative</Label>
            <LabelDescription>
              Vous pouvez transmettre un fichier compressé si il y a plusieurs documents
            </LabelDescription>
            <Input type="file" name="file" id="file" required aria-required="true" />
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

hydrateOnClient(DemanderDelai);
