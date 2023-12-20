import { ProjectEventListDTO } from '../../../modules/frise';
import { ProjectDataForProjectPage } from '../../../modules/project/queries';
import { Request } from 'express';
import React, { FC } from 'react';
import { userIs } from '../../../modules/users';
import {
  Callout,
  Link,
  ExternalLink,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  AlertBox,
  Heading2,
} from '../../components';
import { afficherDate, hydrateOnClient } from '../../helpers';
import {
  EtapesProjet,
  EditProjectData,
  InfoGenerales,
  Contact,
  MaterielsEtTechnologies,
  ResultatsAppelOffreInnovation,
} from './sections';
import { ProjectHeader } from './components';
import routes from '../../../routes';
import { convertirEnIdentifiantProjet } from '@potentiel/domain-usecases';

export type AlerteRaccordement =
  | 'référenceDossierManquantePourDélaiCDC2022'
  | 'demandeComplèteRaccordementManquante';

type ProjectDetailsProps = {
  request: Request;
  project: ProjectDataForProjectPage;
  projectEventList?: ProjectEventListDTO;
  alertesRaccordement?: AlerteRaccordement[];
  abandon?: {
    statut: string;
  };
};

export const ProjectDetails = ({
  request,
  project,
  projectEventList,
  alertesRaccordement,
  abandon,
}: ProjectDetailsProps) => {
  const { user } = request;
  const { error, success } = (request.query as any) || {};

  const identifiantProjet = convertirEnIdentifiantProjet(
    `${project.appelOffreId}#${project.periodeId}#${project.familleId || ''}#${project.numeroCRE}`,
  ).formatter();

  const abandonEnCours = !!abandon && abandon.statut !== 'rejeté';

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-projects">
      <p className="hidden print:block m-0 mb-2 font-semibold">
        Ce document a été édité le {afficherDate(new Date())}. <br />
        Les informations affichées sur cette page reflètent la situation du projet en fonction des
        éléments fournis à Potentiel à date. Elles sont susceptibles de modifications ultérieures.
      </p>
      <ProjectHeader {...{ project, user, abandonEnCours }} />
      <div className="print:hidden">
        {success && <SuccessBox title={success} />}
        {error && <ErrorBox title={error} />}
      </div>
      <div className="flex flex-col gap-3 mt-5">
        <div className="print:hidden flex flex-col gap-3">
          {abandon && (
            <AlertBox title="Abandon">
              <a href={`/laureats/${encodeURIComponent(identifiantProjet)}/abandon`}>
                Voir l'abandon {abandon.statut}
              </a>
            </AlertBox>
          )}

          {alertesRaccordement && (
            <AlerteBoxRaccordement
              dcrDueOn={project.dcrDueOn}
              alertes={alertesRaccordement}
              identifiantProjet={convertirEnIdentifiantProjet({
                appelOffre: project.appelOffreId,
                période: project.periodeId,
                famille: project.familleId,
                numéroCRE: project.numeroCRE,
              }).formatter()}
            />
          )}
          <Callout>
            <CDCInfo {...{ project, user }} />
          </Callout>
        </div>
        <div className="flex flex-col lg:flex-row gap-3">
          {!!projectEventList?.events.length && (
            <EtapesProjet {...{ project, user, projectEventList }} />
          )}
          <div className={`flex flex-col flex-grow gap-3 break-before-page`}>
            <InfoGenerales {...{ project, role: user.role }} />
            <Contact {...{ user, project }} />
            <MaterielsEtTechnologies {...{ project }} />

            {project.notesInnovation && (
              <ResultatsAppelOffreInnovation
                note={project.note}
                notePrix={project.notePrix}
                notesInnovation={project.notesInnovation}
              />
            )}
          </div>
        </div>
        {userIs(['admin', 'dgec-validateur'])(user) && project.notifiedOn && (
          <EditProjectData project={project} request={request} />
        )}
      </div>
    </LegacyPageTemplate>
  );
};

type CDCInfoProps = {
  project: ProjectDataForProjectPage;
  user: Request['user'];
};

const CDCInfo = ({ project: { id: projectId, cahierDesChargesActuel }, user }: CDCInfoProps) => (
  <>
    <Heading2 className="my-0 text-2xl">Cahier des charges</Heading2>{' '}
    <div>
      Instruction selon le cahier des charges{' '}
      {cahierDesChargesActuel.type === 'initial'
        ? 'initial (en vigueur à la candidature)'
        : `${
            cahierDesChargesActuel.alternatif ? 'alternatif' : ''
          } modifié rétroactivement et publié le ${cahierDesChargesActuel.paruLe}`}{' '}
      {cahierDesChargesActuel.url && (
        <>
          (<ExternalLink href={cahierDesChargesActuel.url}>voir le cahier des charges</ExternalLink>
          )
        </>
      )}
      <br />
      {userIs('porteur-projet')(user) && (
        <Link className="flex mt-4" href={`/projet/${projectId}/choisir-cahier-des-charges.html`}>
          Accéder au choix du cahier des charges
        </Link>
      )}
    </div>
  </>
);

const AlerteBoxRaccordement: FC<{
  dcrDueOn: ProjectDataForProjectPage['dcrDueOn'];
  alertes: AlerteRaccordement[];
  identifiantProjet: `${string}#${string}#${string}#${string}`;
}> = ({ dcrDueOn, alertes, identifiantProjet }) => (
  <AlertBox title="Données de raccordement à compléter">
    {alertes.includes('référenceDossierManquantePourDélaiCDC2022') && (
      <p>
        Afin de nous permettre de vérifier si le délai relatif au cahier des charges du 30/08/2022
        concerne le projet pour l'appliquer le cas échéant, nous vous invitons à renseigner une
        référence de dossier de raccordement et à vous assurer que le gestionnaire de réseau indiqué{' '}
        <Link href={routes.GET_LISTE_DOSSIERS_RACCORDEMENT(identifiantProjet)}>sur cette page</Link>{' '}
        est correct.
      </p>
    )}
    {alertes.includes('demandeComplèteRaccordementManquante') && (
      <p>
        Vous devez déposer une demande de raccordement avant le {afficherDate(dcrDueOn)} auprès de
        votre gestionnaire de réseau.
        <br />
        L'accusé de réception de cette demande transmis sur Potentiel facilitera vos démarches
        administratives avec les différents acteurs connectés à Potentiel (DGEC, DREAL,
        Cocontractant, etc.).
      </p>
    )}
    <Link href={routes.GET_LISTE_DOSSIERS_RACCORDEMENT(identifiantProjet)}>
      Mettre à jour les données de raccordement de mon projet
    </Link>
  </AlertBox>
);

hydrateOnClient(ProjectDetails);
