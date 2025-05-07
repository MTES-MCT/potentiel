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
  InfoGenerales,
  Contact,
  MaterielsEtTechnologies,
  ResultatsAppelOffreInnovation,
  ContactProps,
  InfoGeneralesProps,
  GarantiesFinancièresProjetProps,
} from './sections';
import { ProjectHeader } from './components';
import { Routes } from '@potentiel-applications/routes';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../helpers/dataToValueTypes';
// This is a hack to avoid importing the entire Utilisateur package,
// which in turn imports Candidature and breaks the JS due to the crypto dependency.
import * as Role from '@potentiel-domain/utilisateur/dist/role.valueType';
import { Raccordement } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { AbandonInfoBox } from './sections/AbandonInfoBox';

export type AlerteRaccordement =
  | 'référenceDossierManquantePourDélaiCDC2022'
  | 'demandeComplèteRaccordementManquante';

type ProjectDetailsProps = {
  request: Request;
  project: ProjectDataForProjectPage;
  raccordement: Option.Type<Raccordement.ConsulterRaccordementReadModel>;
  projectEventList?: ProjectEventListDTO;
  alertesRaccordement: AlerteRaccordement[];
  abandon?: { statut: string };
  demandeRecours: ProjectDataForProjectPage['demandeRecours'];
  garantiesFinancières?: GarantiesFinancièresProjetProps['garantiesFinancières'];
  représentantLégal?: ContactProps['représentantLégal'];
  actionnaire?: InfoGeneralesProps['actionnaire'];
  puissance?: InfoGeneralesProps['puissance'];
  producteur?: ContactProps['producteur'];
  hasAttestationConformité: boolean;
  modificationsNonPermisesParLeCDCActuel: boolean;
  coefficientKChoisi: boolean | undefined;
  cdcV2: boolean;
  candidature: ContactProps['candidature'];
};

export const ProjectDetails = ({
  request,
  project,
  projectEventList,
  raccordement,
  alertesRaccordement,
  abandon,
  demandeRecours,
  hasAttestationConformité,
  représentantLégal,
  actionnaire,
  garantiesFinancières,
  puissance,
  modificationsNonPermisesParLeCDCActuel,
  coefficientKChoisi,
  cdcV2,
  producteur,
  candidature,
}: ProjectDetailsProps) => {
  const { user } = request;
  const { error, success } = (request.query as any) || {};

  const identifiantProjet = formatProjectDataToIdentifiantProjetValueType({
    appelOffreId: project.appelOffreId,
    periodeId: project.periodeId,
    familleId: project.familleId,
    numeroCRE: project.numeroCRE,
  }).formatter();

  const abandonEnCoursOuAccordé = !!abandon && abandon.statut !== 'rejeté';

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
        abandonEnCoursOuAccordé={abandonEnCoursOuAccordé}
        modificationsNonPermisesParLeCDCActuel={modificationsNonPermisesParLeCDCActuel}
        hasAttestationConformité={hasAttestationConformité}
        demandeRecours={demandeRecours}
        peutFaireDemandeChangementReprésentantLégal={
          !!représentantLégal?.demandeDeModification?.peutFaireUneDemande
        }
        puissanceAffichage={puissance?.affichage}
        actionnaireAffichage={actionnaire?.affichage}
        producteurAffichage={producteur?.affichage}
      />
      <div className="print:hidden">
        {success && <SuccessBox title={success} />}
        {error && <ErrorBox title={error} />}
      </div>
      <div className="flex flex-col gap-3 mt-5">
        <div className="print:hidden flex flex-col gap-3">
          {abandon && <AbandonInfoBox abandon={abandon} identifiantProjet={identifiantProjet} />}
          {user.role === 'porteur-projet' && modificationsNonPermisesParLeCDCActuel && (
            <AlertBox>
              Votre cahier des charges actuel ne vous permet pas d'accéder aux fonctionnalités
              dématérialisées d'information au Préfet et de modification de votre projet (abandon,
              recours...), vous devez d'abord choisir un cahier des charges modificatif (encart
              "Cahier des charges" ci-dessous).
            </AlertBox>
          )}

          {alertesRaccordement.length > 0 && (
            <AlerteBoxRaccordement
              dcrDueOn={project.dcrDueOn}
              alertes={alertesRaccordement}
              identifiantProjet={identifiantProjet}
            />
          )}
          <Callout>
            <CDCInfo
              cahierDesChargesActuel={project.cahierDesChargesActuel}
              user={user}
              urlChoixCdc={
                cdcV2
                  ? Routes.CahierDesCharges.choisir(identifiantProjet)
                  : `/projet/${project.id}/choisir-cahier-des-charges.html`
              }
            />
          </Callout>
        </div>
        <div className="flex flex-col lg:flex-row gap-3">
          {!!projectEventList?.events.length && (
            <EtapesProjet {...{ project, user, projectEventList }} />
          )}
          <div className={`flex flex-col flex-grow gap-3 break-before-page`}>
            <InfoGenerales
              project={project}
              role={Role.convertirEnValueType(user.role)}
              raccordement={raccordement}
              demandeRecours={demandeRecours}
              garantiesFinancières={garantiesFinancières}
              actionnaire={actionnaire}
              puissance={puissance}
              modificationsNonPermisesParLeCDCActuel={modificationsNonPermisesParLeCDCActuel}
              coefficientKChoisi={coefficientKChoisi}
            />
            <Contact
              identifiantProjet={identifiantProjet}
              project={project}
              user={user}
              représentantLégal={représentantLégal}
              producteur={producteur}
              modificationsNonPermisesParLeCDCActuel={modificationsNonPermisesParLeCDCActuel}
              candidature={candidature}
            />
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
      </div>
    </LegacyPageTemplate>
  );
};

type CDCInfoProps = Pick<ProjectDataForProjectPage, 'cahierDesChargesActuel'> & {
  user: Request['user'];
  urlChoixCdc: string;
};

const CDCInfo = ({ cahierDesChargesActuel, user, urlChoixCdc }: CDCInfoProps) => (
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
        <Link className="flex mt-4" href={urlChoixCdc}>
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
