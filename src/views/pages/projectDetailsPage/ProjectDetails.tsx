import { ProjectEventListDTO } from '@modules/frise';
import { ProjectDataForProjectPage } from '@modules/project/queries';
import { Request } from 'express';
import React, { FC } from 'react';
import { userIs } from '@modules/users';
import {
  Callout,
  Link,
  ExternalLink,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  AlertBox,
  PrimaryButton,
  InfoBox,
  Heading2,
  Form,
} from '@components';
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
import routes from '@routes';
import { convertirEnIdentifiantProjet } from '@potentiel/domain';

export type AlerteRaccordement =
  | 'référenceDossierManquantePourDélaiCDC2022'
  | 'demandeComplèteRaccordementManquante';

type ProjectDetailsProps = {
  request: Request;
  project: ProjectDataForProjectPage;
  projectEventList?: ProjectEventListDTO;
  now: number;
  alertesRaccordement?: AlerteRaccordement[];
};

export const ProjectDetails = ({
  request,
  project,
  projectEventList,
  now,
  alertesRaccordement,
}: ProjectDetailsProps) => {
  const { user } = request;
  const { error, success } = (request.query as any) || {};

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-projects">
      <ProjectHeader {...{ project, user }} />
      {success && <SuccessBox title={success} />}
      {error && <ErrorBox title={error} />}
      <main className="flex flex-col gap-3 mt-5">
        {project.alerteAnnulationAbandon && userIs('porteur-projet')(user) && (
          <AlerteAnnulationAbandonPossible
            {...{ ...project, alerteAnnulationAbandon: project.alerteAnnulationAbandon }}
          />
        )}

        {alertesRaccordement && (
          <AlerteBoxRaccordement
            dcrDueOn={project.dcrDueOn}
            now={now}
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
        <div className="flex flex-col lg:flex-row gap-3">
          {projectEventList && <EtapesProjet {...{ project, user, projectEventList }} />}
          <div className={`flex flex-col flex-grow gap-3`}>
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
      </main>
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
      (<ExternalLink href={cahierDesChargesActuel.url}>voir le cahier des charges</ExternalLink>)
      <br />
      {userIs('porteur-projet')(user) && (
        <Link className="flex mt-4" href={`/projet/${projectId}/choisir-cahier-des-charges.html`}>
          Accéder au choix du cahier des charges
        </Link>
      )}
    </div>
  </>
);

const AlerteAnnulationAbandonPossible = ({
  id: projetId,
  alerteAnnulationAbandon,
}: {
  id: ProjectDataForProjectPage['id'];
  alerteAnnulationAbandon: NonNullable<ProjectDataForProjectPage['alerteAnnulationAbandon']>;
}) => (
  <>
    {alerteAnnulationAbandon.actionPossible === 'voir-demande-en-cours' ? (
      <InfoBox title="Annulation abandon">
        <p>
          Une demande d'annulation d'abandon est en cours pour ce projet.
          <br />
          <Link href={alerteAnnulationAbandon.urlDemandeEnCours}>Voir la demande</Link>
        </p>
      </InfoBox>
    ) : (
      <AlertBox title="Annulation abandon">
        {alerteAnnulationAbandon.actionPossible === 'demander-annulation-abandon' && (
          <>
            <p className="m-0">
              Vous avez la possibilité d'annuler l'abandon de votre projet avant le{' '}
              {alerteAnnulationAbandon.dateLimite}.
            </p>
            <Form
              method="post"
              action={routes.POST_DEMANDER_ANNULATION_ABANDON}
              className="m-0 p-0"
            >
              <input type="hidden" name="projetId" value={projetId} />
              <PrimaryButton
                type="submit"
                confirmation="Confirmez-vous la création d'une demande d'annulation d'abandon du projet ?"
                className="mt-4"
              >
                Demander l'annulation de l'abandon
              </PrimaryButton>
            </Form>
          </>
        )}

        {alerteAnnulationAbandon.actionPossible === 'choisir-nouveau-cdc' && (
          <p className="m-0">
            Pour pouvoir faire une demande d'annulation d'abandon, vous devez d'abord choisir l'un
            des cahiers des charges suivants :
            <ul>
              {alerteAnnulationAbandon.cdcAvecOptionAnnulationAbandon.map(
                ({ paruLe, type, alternatif }) => (
                  <li>{`Cahier des charges ${
                    alternatif ? `alternatif` : ''
                  } ${type} paru le ${paruLe}`}</li>
                ),
              )}
            </ul>
            Le lien vers le formulaire de changement de cahier des charges est disponible dans
            l'encart ci-dessous.
          </p>
        )}
      </AlertBox>
    )}
  </>
);

const AlerteBoxRaccordement: FC<{
  dcrDueOn: ProjectDataForProjectPage['dcrDueOn'];
  now: number;
  alertes: AlerteRaccordement[];
  identifiantProjet: `${string}#${string}#${string}#${string}`;
}> = ({ dcrDueOn, now, alertes, identifiantProjet }) => (
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
        L'accusé de réception de la demande complète de raccordement doit être transmis dans
        Potentiel avant le {afficherDate(dcrDueOn)}.{' '}
        {now > dcrDueOn && <span>Vous êtes donc en retard sur ce délai.</span>}
      </p>
    )}
    <Link href={routes.GET_LISTE_DOSSIERS_RACCORDEMENT(identifiantProjet)}>
      Mettre à jour les données de raccordement de mon projet
    </Link>
  </AlertBox>
);

hydrateOnClient(ProjectDetails);
