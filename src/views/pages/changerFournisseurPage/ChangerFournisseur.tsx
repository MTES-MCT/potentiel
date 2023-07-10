import React, { useState } from 'react';
import { ProjectAppelOffre } from '@entities';
import routes from '@routes';
import { Request } from 'express';

import {
  ChoisirCahierDesChargesFormulaire,
  ProjectInfo,
  PrimaryButton,
  Label,
  SecondaryLinkButton,
  InfoBox,
  InfoLienGuideUtilisationCDC,
  AlertBox,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  Heading1,
  Heading2,
  ProjectProps,
  Input,
  TextArea,
  Form,
} from '@components';
import { hydrateOnClient } from '../../helpers';
import { CHAMPS_FOURNISSEURS, CORRESPONDANCE_CHAMPS_FOURNISSEURS } from '@modules/project';

type ChangerFournisseurProps = {
  request: Request;
  project: ProjectProps & {
    cahierDesChargesActuel: string;
    evaluationCarbone: number;
    evaluationCarboneDeRéférence: number;
    details?: { [key: string]: string };
  };
  appelOffre: ProjectAppelOffre;
};

export const ChangerFournisseur = ({ request, project, appelOffre }: ChangerFournisseurProps) => {
  const { error, success, justification } = (request.query as any) || {};

  const doitChoisirCahierDesCharges =
    appelOffre.choisirNouveauCahierDesCharges && project.cahierDesChargesActuel === 'initial';

  const [evaluationCarbone, setEvaluationCarbone] = useState<number | undefined>();

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-requests">
      <Heading1 className="mb-10">Je signale un changement de fournisseur</Heading1>

      {doitChoisirCahierDesCharges ? (
        <ChoisirCahierDesChargesFormulaire
          {...{
            projet: {
              id: project.id,
              appelOffre,
              cahierDesChargesActuel: 'initial',
              identifiantGestionnaireRéseau: project.identifiantGestionnaire,
            },
            redirectUrl: routes.CHANGER_FOURNISSEUR(project.id),
            type: 'fournisseur',
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
          action={routes.CHANGEMENT_FOURNISSEUR_ACTION}
          method="post"
          encType="multipart/form-data"
          className="mx-auto"
        >
          <input type="hidden" name="projectId" value={project.id} />
          <div>
            <div className="mb-2">Concernant le projet:</div>
            <ProjectInfo project={project} />
          </div>
          {success && <SuccessBox title={success} />}
          {error && <ErrorBox title={error} />}

          {CHAMPS_FOURNISSEURS.map((champ) => (
            <div key={champ}>
              <Heading2 className="mt-4 mb-1">{CORRESPONDANCE_CHAMPS_FOURNISSEURS[champ]}</Heading2>
              {project.details?.[champ] && <p>Ancien fournisseur : {project.details?.[champ]}</p>}
              <Label htmlFor={champ.replace(/ /g, '_').replace(/\n/g, '')} className="mt-2">
                {champ}
              </Label>
              <Input
                type="text"
                name={champ.replace(/\n/g, '\\n')}
                id={champ.replace(/ /g, '_').replace(/\n/g, '')}
              />
            </div>
          ))}
          {project.evaluationCarbone > 0 && (
            <div>
              <Heading2 className="mt-4 mb-1">évaluation carbone</Heading2>
              {project.evaluationCarboneDeRéférence && (
                <p>
                  Évaluation carbone initiale (kg eq CO2/kWc) :{' '}
                  {project.evaluationCarboneDeRéférence}
                </p>
              )}
              {project.evaluationCarbone && (
                <p>Évaluation carbone actuelle (kg eq CO2/kWc) : {project.evaluationCarbone}</p>
              )}
              <Label htmlFor="evaluationCarbone">Nouvelle évaluation carbone (kg eq CO2/kWc)</Label>
              <Input
                onChange={(e) => setEvaluationCarbone(parseFloat(e.target.value))}
                type="number"
                name="evaluationCarbone"
                id="evaluationCarbone"
              />
              {evaluationCarbone &&
                evaluationCarbone > project.evaluationCarboneDeRéférence &&
                Math.round(evaluationCarbone / 50) !==
                  Math.round(project.evaluationCarboneDeRéférence / 50) && (
                  <AlertBox className="mt-4">
                    Cette nouvelle valeur entraîne une dégradation de la note du projet, celui-ci ne
                    recevra pas d'attestation de conformité.
                  </AlertBox>
                )}
            </div>
          )}
          <div>
            <Label htmlFor="file">Pièce-jointe</Label>
            <Input type="file" name="file" id="file" />
          </div>
          <div>
            <Label htmlFor="justification">
              <strong>Veuillez nous indiquer les raisons qui motivent votre demande</strong>
              <br />
              Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant
              conduit à ce besoin de modification (contexte, facteurs extérieurs, etc)
            </Label>
            <TextArea name="justification" id="justification" defaultValue={justification || ''} />
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

hydrateOnClient(ChangerFournisseur);
