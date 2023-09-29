import React from 'react';
import { ProjectAppelOffre } from '../../../entities';
import routes from '../../../routes';
import { Request } from 'express';

import {
  ProjectInfo,
  PrimaryButton,
  Label,
  InfoBox,
  ChoisirCahierDesChargesFormulaire,
  InfoLienGuideUtilisationCDC,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  Heading1,
  SecondaryLinkButton,
  ProjectProps,
  Input,
  TextArea,
  Form,
  ChampsObligatoiresLégende,
  LabelDescription,
  Checkbox,
  AlertBox,
} from '../../components';
import { hydrateOnClient } from '../../helpers';

type DemanderAbandonProps = {
  request: Request;
  project: ProjectProps & { cahierDesChargesActuel: string };
  appelOffre: ProjectAppelOffre;
};

export const DemanderAbandon = ({ request, project, appelOffre }: DemanderAbandonProps) => {
  const { error, success, justification } = (request.query as any) || {};
  const doitChoisirCahierDesCharges =
    appelOffre.choisirNouveauCahierDesCharges && project.cahierDesChargesActuel === 'initial';

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-requests">
      <Heading1 className="mb-10">Je demande un abandon de mon projet</Heading1>

      {doitChoisirCahierDesCharges ? (
        <ChoisirCahierDesChargesFormulaire
          projet={{
            id: project.id,
            appelOffre,
            cahierDesChargesActuel: 'initial',
            identifiantGestionnaireRéseau: project.identifiantGestionnaire,
          }}
          redirectUrl={routes.GET_DEMANDER_ABANDON(project.id)}
          type="abandon"
          infoBox={
            <InfoBox
              title="Afin d'accéder au formulaire de demande d'abandon, vous devez d'abord changer le
                  cahier des charges à appliquer"
              className="mb-5"
            >
              <InfoLienGuideUtilisationCDC />
            </InfoBox>
          }
        />
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <Form
            action={routes.POST_DEMANDER_ABANDON}
            method="post"
            encType="multipart/form-data"
            className="order-2 md:order-1 md:mx-auto"
          >
            {success && <SuccessBox title={success} />}
            {error && <ErrorBox title={error} />}
            <div>
              <div className="mb-2">Concernant le projet:</div>
              <ProjectInfo project={project} />
            </div>

            <ChampsObligatoiresLégende />
            <input type="hidden" name="projectId" value={project.id} />

            <div>
              <Label htmlFor="justification">
                Veuillez nous indiquer les raisons qui motivent votre demande
              </Label>
              <LabelDescription>
                Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant
                conduit à ce besoin de modification (contexte, facteurs extérieurs, etc)
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

            {appelOffre.periode.abandonAvecRecandidature && (
              <>
                <AlertBox>
                  <div className="font-bold">Demande d'abandon avec recandidature</div>
                  <div>
                    <p className="m-0 mt-4">
                      Je m'engage sur l'honneur à ne pas avoir débuté mes travaux au sens du cahier
                      des charges de l'AO associé et a abandonné mon statut de lauréat au profit
                      d'une recandidature réalisée au plus tard le 31/12/2024. Je m'engage sur
                      l'honneur à ce que cette recandidature respecte les conditions suivantes :
                    </p>
                    <ul className="mb-0">
                      <li>
                        Que le dossier soit complet et respecte les conditions d'éligibilité du
                        cahier des charges concerné
                      </li>
                      <li>Le même lieu d'implantation que le projet abandonné</li>
                      <li>Une puissance équivalente à plus ou moins 20% que le projet abandonné</li>
                      <li>
                        Le tarif proposé ne doit pas être supérieur au prix plafond de la période
                        dont le projet était initialement lauréat, indexé jusqu’à septembre 2023
                        selon la formule d’indexation du prix de référence indiquée dans le cahier
                        des charges concerné par la recandidature.
                      </li>
                    </ul>
                  </div>
                  <Checkbox
                    name="abandonAvecRecandidature"
                    id="abandonAvecRecandidature"
                    className="my-7 font-bold"
                  >
                    Abandon de mon projet avec recandidature (optionnel)
                  </Checkbox>
                </AlertBox>
              </>
            )}

            <div className="mx-auto flex flex-col md:flex-row gap-4 items-center mt-4">
              <PrimaryButton type="submit" id="submit">
                Envoyer
              </PrimaryButton>
              <SecondaryLinkButton href={routes.LISTE_PROJETS}>Annuler</SecondaryLinkButton>
            </div>
          </Form>
        </div>
      )}
    </LegacyPageTemplate>
  );
};

hydrateOnClient(DemanderAbandon);
