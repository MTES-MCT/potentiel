import {
  ProjectInfo,
  TextArea,
  Astérisque,
  Input,
  FormulaireChampsObligatoireLégende,
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
} from '@components';
import routes from '@routes';
import { ProjectAppelOffre } from '@entities';

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
      <div className="panel">
        <div className="panel__header">
          <Heading1>Je demande un délai supplémentaire</Heading1>
        </div>

        {doitChoisirCahierDesCharges ? (
          <div className="flex flex-col max-w-2xl mx-auto">
            <InfoBox
              title="Afin d'accéder au formulaire de demande de délai, vous devez d'abord changer le
                  cahier des charges à appliquer"
              className="mb-5"
            >
              <InfoLienGuideUtilisationCDC />
            </InfoBox>
            <ChoisirCahierDesChargesFormulaire
              {...{
                projet: {
                  id: project.id,
                  appelOffre,
                  cahierDesChargesActuel: 'initial',
                  identifiantGestionnaireRéseau: project.identifiantGestionnaire,
                },
                redirectUrl: routes.DEMANDER_DELAI(project.id),
                type: 'delai',
              }}
            />
          </div>
        ) : (
          <form action={routes.DEMANDE_DELAI_ACTION} method="post" encType="multipart/form-data">
            <input type="hidden" name="projectId" value={project.id} />
            <div className="form__group">
              {success && <SuccessBox title={success} />}
              {error && <ErrorBox title={error as string} />}

              <FormulaireChampsObligatoireLégende className="text-right" />
              <div className="mb-1">Concernant le projet:</div>
              <ProjectInfo project={project} className="mb-3" />
              <div>
                <div className="flex flex-col gap-5">
                  <div>
                    <label>Date théorique d'achèvement</label>
                    <Input
                      type="text"
                      disabled
                      defaultValue={format(project.completionDueOn, 'dd/MM/yyyy')}
                    />
                  </div>
                  <div>
                    <label htmlFor="dateAchevementDemandee">
                      Saisissez la date limite d'achèvement souhaitée <Astérisque />
                    </label>
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
                    <label htmlFor="justification">
                      Veuillez nous indiquer les raisons qui motivent votre demande
                      <br />
                      <span className="italic">
                        Pour faciliter le traitement de votre demande, veillez à détailler les
                        raisons ayant conduit à ce besoin de modification (contexte, facteurs
                        extérieurs, etc.)
                      </span>
                    </label>
                    <TextArea
                      name="justification"
                      id="justification"
                      defaultValue={justification || ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="file">Pièce justificative (si nécessaire)</Label>
                    <Input type="file" name="file" id="file" />
                  </div>
                </div>

                <PrimaryButton type="submit" id="submit" className="mt-4 mr-2">
                  Envoyer
                </PrimaryButton>
                <SecondaryLinkButton href={routes.LISTE_PROJETS}>Annuler</SecondaryLinkButton>
              </div>
            </div>
          </form>
        )}
      </div>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(DemanderDelai);
