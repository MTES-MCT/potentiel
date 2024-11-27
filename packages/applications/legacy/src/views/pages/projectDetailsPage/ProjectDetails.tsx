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
  InfoBox,
} from '../../components';
import { afficherDate, hydrateOnClient } from '../../helpers';
import {
  EtapesProjet,
  EditProjectData,
  InfoGenerales,
  Contact,
  MaterielsEtTechnologies,
  ResultatsAppelOffreInnovation,
  ContactProps,
} from './sections';
import { ProjectHeader } from './components';
import { Routes } from '@potentiel-applications/routes';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../helpers/dataToValueTypes';

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
  demandeRecours: ProjectDataForProjectPage['demandeRecours'];
  hasAttestationConformité: boolean;
  représentantLégal?: ContactProps['représentantLégal'];
};

export const ProjectDetails = ({
  request,
  project,
  projectEventList,
  alertesRaccordement,
  abandon,
  demandeRecours,
  hasAttestationConformité,
  représentantLégal,
}: ProjectDetailsProps) => {
  const { user } = request;
  const { error, success } = (request.query as any) || {};

  const identifiantProjet = formatProjectDataToIdentifiantProjetValueType({
    appelOffreId: project.appelOffreId,
    periodeId: project.periodeId,
    familleId: project.familleId,
    numeroCRE: project.numeroCRE,
  }).formatter();

  const abandonEnCours = !!abandon && abandon.statut !== 'rejeté';
  const modificationsNonPermisesParLeCDCActuel =
    project.cahierDesChargesActuel.type === 'initial' &&
    !!project.appelOffre.periode.choisirNouveauCahierDesCharges;

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-projects">
      <p className="hidden print:block m-0 mb-2 font-semibold">
        Ce document a été édité le {afficherDate(new Date())}. <br />
        Les informations affichées sur cette page reflètent la situation du projet en fonction des
        éléments fournis à Potentiel à date. Elles sont susceptibles de modifications ultérieures.
      </p>
      <ProjectHeader
        user={user}
        project={project}
        abandonEnCours={abandonEnCours}
        modificationsNonPermisesParLeCDCActuel={modificationsNonPermisesParLeCDCActuel}
        hasAttestationConformité={hasAttestationConformité}
        demandeRecours={demandeRecours}
      />
      <div className="print:hidden">
        {success && <SuccessBox title={success} />}
        {error && <ErrorBox title={error} />}
      </div>
      <div className="flex flex-col gap-3 mt-5">
        <div className="print:hidden flex flex-col gap-3">
          {abandon && (
            <AlertBox title={`Abandon ${abandon.statut}`}>
              <a href={Routes.Abandon.détail(identifiantProjet)}>Voir les détails de l'abandon</a>
            </AlertBox>
          )}
          {user.role === 'porteur-projet' && modificationsNonPermisesParLeCDCActuel && (
            <InfoBox>
              Votre cahier des charges actuel ne vous permet pas d'accéder aux fonctionnalités
              dématérialisées d'information au Préfet et de modification de votre projet (abandon,
              recours...), vous devez d'abord choisir un cahier des charges modificatif (encart
              "Cahier des charges" ci-dessous).
            </InfoBox>
          )}

          {alertesRaccordement && project.appelOffre.typeAppelOffre !== 'biométhane' && (
            <AlerteBoxRaccordement
              dcrDueOn={project.dcrDueOn}
              alertes={alertesRaccordement}
              identifiantProjet={identifiantProjet}
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
            <InfoGenerales project={project} role={user.role} demandeRecours={demandeRecours} />
            <Contact project={project} user={user} représentantLégal={représentantLégal} />
            <MaterielsEtTechnologies
              fournisseur={project.fournisseur}
              evaluationCarbone={project.evaluationCarbone}
            />

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
  identifiantProjet: string;
}> = ({ dcrDueOn, alertes, identifiantProjet }) => (
  <AlertBox title="Données de raccordement à compléter">
    {alertes.includes('référenceDossierManquantePourDélaiCDC2022') && (
      <p>
        Afin de nous permettre de vérifier si le délai relatif au cahier des charges du 30/08/2022
        concerne le projet pour l'appliquer le cas échéant, nous vous invitons à renseigner une
        référence de dossier de raccordement et à vous assurer que le gestionnaire de réseau indiqué{' '}
        <Link href={Routes.Raccordement.détail(identifiantProjet)}>sur cette page</Link> est
        correct.
      </p>
    )}
    {alertes.includes('demandeComplèteRaccordementManquante') && (
      <p>
        Vous devez déposer une demande de raccordement avant le {afficherDate(dcrDueOn)} auprès de
        votre gestionnaire de réseau.
        <br />
        L'accusé de réception de cette demande ainsi que les documents complémentaires (proposition
        technique et financière…) transmis sur Potentiel faciliteront vos démarches administratives
        avec les différents acteurs connectés à Potentiel (DGEC, services de l'Etat en région,
        Cocontractant, etc.).
      </p>
    )}
    <Link href={Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet)}>
      Mettre à jour les données de raccordement de mon projet
    </Link>
  </AlertBox>
);

hydrateOnClient(ProjectDetails);
