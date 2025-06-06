import React, { useState } from 'react';
import { ProjectAppelOffre } from '../../../entities';
import routes from '../../../routes';
import { Request } from 'express';

import {
  ProjectInfo,
  PrimaryButton,
  Label,
  SecondaryLinkButton,
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
  ChampsObligatoiresLégende,
  LabelDescription,
  InputFile,
} from '../../components';
import { hydrateOnClient } from '../../helpers';
import { CHAMPS_FOURNISSEURS, CORRESPONDANCE_CHAMPS_FOURNISSEURS } from '../../../modules/project';

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

  const [evaluationCarbone, setEvaluationCarbone] = useState<number | undefined>();

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-requests">
      <Heading1 className="mb-10">Je signale un changement de fournisseur</Heading1>

      <Form
        action={routes.CHANGEMENT_FOURNISSEUR_ACTION}
        method="post"
        encType="multipart/form-data"
        className="mx-auto gap-8"
      >
        <input type="hidden" name="projectId" value={project.id} />
        <div>
          <div className="mb-2">Concernant le projet:</div>
          <ProjectInfo project={project} />
        </div>
        {success && <SuccessBox title={success} />}
        {error && <ErrorBox title={error} />}

        <ChampsObligatoiresLégende />
        {CHAMPS_FOURNISSEURS.map((champ) => (
          <div key={champ}>
            <div className="mb-3">
              <Heading2 className="m-0 text-xl">
                {CORRESPONDANCE_CHAMPS_FOURNISSEURS[champ]}
              </Heading2>
              {project.details?.[champ] && (
                <p className="m-0 italic">Ancien fournisseur : {project.details?.[champ]}</p>
              )}
            </div>
            <Label htmlFor={champ.replace(/ /g, '_').replace(/\n/g, '')} optionnel>
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
            <div className="mb-3">
              <Heading2 className="m-0 text-xl">évaluation carbone</Heading2>
              {project.evaluationCarboneDeRéférence && (
                <p className="m-0 italic">
                  Évaluation carbone initiale (kg eq CO2/kWc) :{' '}
                  {project.evaluationCarboneDeRéférence}
                </p>
              )}
              {project.evaluationCarbone && (
                <p className="m-0 italic">
                  Évaluation carbone actuelle (kg eq CO2/kWc) : {project.evaluationCarbone}
                </p>
              )}
            </div>
            <Label htmlFor="evaluationCarbone" optionnel>
              Nouvelle évaluation carbone (kg eq CO2/kWc)
            </Label>
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
          <InputFile />
        </div>
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

hydrateOnClient(ChangerFournisseur);
