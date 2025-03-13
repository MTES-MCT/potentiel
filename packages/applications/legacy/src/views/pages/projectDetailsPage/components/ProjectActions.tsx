import { Routes } from '@potentiel-applications/routes';
import React from 'react';
import { User } from '../../../../entities';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../../helpers/dataToValueTypes';
import { ProjectDataForProjectPage } from '../../../../modules/project';
import { userIs } from '../../../../modules/users';
import routes from '../../../../routes';
import {
  PreviewLinkButton,
  DropdownMenuSecondaryButton,
  PrimaryButton,
  PrintIcon,
  SecondaryLinkButton,
  DownloadLinkButton,
  LinkButton,
} from '../../../components';
import { match } from 'ts-pattern';

type EnregistrerUneModificationProps = {
  projectId: ProjectDataForProjectPage['id'];
};

const EnregistrerUneModification = ({ projectId }: EnregistrerUneModificationProps) => (
  <DropdownMenuSecondaryButton buttonChildren="Enregistrer une modification">
    <></>
    <DropdownMenuSecondaryButton.DropdownItem
      href={routes.ADMIN_SIGNALER_DEMANDE_DELAI_PAGE(projectId)}
    >
      <span>Demande de délai</span>
    </DropdownMenuSecondaryButton.DropdownItem>
  </DropdownMenuSecondaryButton>
);

type PorteurProjetActionsProps = {
  project: ProjectDataForProjectPage;
  abandonEnCoursOuAccordé: boolean;
  demandeRecours: ProjectDataForProjectPage['demandeRecours'];
  modificationsNonPermisesParLeCDCActuel: boolean;
  hasAttestationConformité: boolean;
  peutFaireDemandeChangementReprésentantLégal: boolean;
  actionnaireMenu?: {
    action?: string;
    url: string;
  };
};

const PorteurProjetActions = ({
  project,
  abandonEnCoursOuAccordé,
  demandeRecours,
  modificationsNonPermisesParLeCDCActuel,
  hasAttestationConformité,
  peutFaireDemandeChangementReprésentantLégal,
  actionnaireMenu,
}: PorteurProjetActionsProps) => {
  const identifiantProjet = formatProjectDataToIdentifiantProjetValueType({
    appelOffreId: project.appelOffreId,
    periodeId: project.periodeId,
    familleId: project.familleId,
    numeroCRE: project.numeroCRE,
  }).formatter();
  const peutDemanderAbandon = !abandonEnCoursOuAccordé && !hasAttestationConformité;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col xl:flex-row gap-2">
        {!project.isClasse && !demandeRecours && (
          <SecondaryLinkButton
            href={Routes.Recours.demander(identifiantProjet)}
            disabled={modificationsNonPermisesParLeCDCActuel ? true : undefined}
          >
            Faire une demande de recours
          </SecondaryLinkButton>
        )}

        {project.isClasse && (
          <DropdownMenuSecondaryButton buttonChildren="Actions" className="w-fit">
            {project.appelOffre.changementProducteurPossibleAvantAchèvement && (
              <DropdownMenuSecondaryButton.DropdownItem
                href={routes.GET_CHANGER_PRODUCTEUR(project.id)}
              >
                <span>Changer de producteur</span>
              </DropdownMenuSecondaryButton.DropdownItem>
            )}
            <DropdownMenuSecondaryButton.DropdownItem href={routes.CHANGER_FOURNISSEUR(project.id)}>
              <span>Changer de fournisseur</span>
            </DropdownMenuSecondaryButton.DropdownItem>
            {actionnaireMenu?.action ? (
              <DropdownMenuSecondaryButton.DropdownItem
                href={actionnaireMenu.url}
                disabled={modificationsNonPermisesParLeCDCActuel ? true : undefined}
              >
                <span>{actionnaireMenu.action}</span>
              </DropdownMenuSecondaryButton.DropdownItem>
            ) : (
              <></>
            )}
            <DropdownMenuSecondaryButton.DropdownItem
              href={routes.DEMANDER_CHANGEMENT_PUISSANCE(project.id)}
            >
              <span>Changer de puissance</span>
            </DropdownMenuSecondaryButton.DropdownItem>
            <DropdownMenuSecondaryButton.DropdownItem href={routes.DEMANDER_DELAI(project.id)}>
              <span>Demander un délai</span>
            </DropdownMenuSecondaryButton.DropdownItem>
            {peutFaireDemandeChangementReprésentantLégal && (
              <DropdownMenuSecondaryButton.DropdownItem
                href={Routes.ReprésentantLégal.changement.demander(identifiantProjet)}
                disabled={modificationsNonPermisesParLeCDCActuel ? true : undefined}
              >
                <span>Demander un changement de représentant légal</span>
              </DropdownMenuSecondaryButton.DropdownItem>
            )}
            {peutDemanderAbandon && (
              <>
                <DropdownMenuSecondaryButton.DropdownItem
                  href={Routes.Abandon.demander(identifiantProjet)}
                  disabled={modificationsNonPermisesParLeCDCActuel ? true : undefined}
                >
                  <span>Demander un abandon</span>
                </DropdownMenuSecondaryButton.DropdownItem>
                {!hasAttestationConformité && getProjectStatus(project) === 'lauréat' && (
                  <DropdownMenuSecondaryButton.DropdownItem
                    href={Routes.Achèvement.transmettreAttestationConformité(identifiantProjet)}
                  >
                    <span>Transmettre l'attestation de conformité</span>
                  </DropdownMenuSecondaryButton.DropdownItem>
                )}
              </>
            )}
          </DropdownMenuSecondaryButton>
        )}

        {project.notifiedOn && !project.isLegacy && (
          <DownloadLinkButton
            className="w-fit"
            fileUrl={Routes.Candidature.téléchargerAttestation(identifiantProjet)}
          >
            Télécharger mon attestation
          </DownloadLinkButton>
        )}
        <PrimaryButton onClick={() => window.print()}>
          <PrintIcon className="text-white mr-2" aria-hidden />
          Imprimer la page
        </PrimaryButton>
      </div>
    </div>
  );
};

type AdminActionsProps = {
  project: ProjectDataForProjectPage;
};
const AdminActions = ({
  project: { appelOffreId, periodeId, familleId, numeroCRE, id, notifiedOn, isLegacy, isClasse },
}: AdminActionsProps) => {
  const identifiantProjet = formatProjectDataToIdentifiantProjetValueType({
    appelOffreId: appelOffreId,
    periodeId: periodeId,
    familleId: familleId,
    numeroCRE: numeroCRE,
  }).formatter();

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <EnregistrerUneModification projectId={id} />
      {notifiedOn && isClasse ? (
        <LinkButton href={Routes.Lauréat.modifier(identifiantProjet)}>
          Modifier le projet
        </LinkButton>
      ) : (
        <LinkButton href={Routes.Candidature.corriger(identifiantProjet)}>
          Modifier la candidature
        </LinkButton>
      )}
      {match({
        notifiedOn: !!notifiedOn,
        isLegacy: isLegacy,
      })
        .with({ notifiedOn: true, isLegacy: false }, () => (
          <DownloadLinkButton
            fileUrl={Routes.Candidature.téléchargerAttestation(identifiantProjet)}
            className="m-auto"
          >
            Voir attestation
          </DownloadLinkButton>
        ))
        .with({ notifiedOn: false, isLegacy: false }, () => (
          <PreviewLinkButton
            fileUrl={Routes.Candidature.prévisualiserAttestation(identifiantProjet)}
            className="m-auto"
          >
            Aperçu attestation
          </PreviewLinkButton>
        ))
        .otherwise(() => null)}
      <PrimaryButton className="m-auto inline-flex items-center" onClick={() => window.print()}>
        <PrintIcon className="text-white mr-2" aria-hidden />
        Imprimer la page
      </PrimaryButton>
    </div>
  );
};

type DrealActionsProps = {
  project: ProjectDataForProjectPage;
};
const DrealActions = ({ project }: DrealActionsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <EnregistrerUneModification projectId={project.id} />
      <PrimaryButton onClick={() => window.print()}>
        <PrintIcon className="text-white mr-2" aria-hidden />
        Imprimer la page
      </PrimaryButton>
    </div>
  );
};

type ProjectActionsProps = {
  project: ProjectDataForProjectPage;
  user: User;
  abandonEnCoursOuAccordé: boolean;
  demandeRecours: ProjectDataForProjectPage['demandeRecours'];
  modificationsNonPermisesParLeCDCActuel: boolean;
  hasAttestationConformité: boolean;
  peutFaireDemandeChangementReprésentantLégal: boolean;
  actionnaireMenu?: {
    label: string;
    action?: string;
    url: string;
  };
};

export const ProjectActions = ({
  project,
  user,
  abandonEnCoursOuAccordé,
  demandeRecours,
  modificationsNonPermisesParLeCDCActuel,
  hasAttestationConformité,
  peutFaireDemandeChangementReprésentantLégal,
  actionnaireMenu,
}: ProjectActionsProps) => (
  <div className="print:hidden whitespace-nowrap">
    {userIs(['admin', 'dgec-validateur'])(user) && <AdminActions {...{ project }} />}
    {userIs(['porteur-projet'])(user) && (
      <PorteurProjetActions
        project={project}
        abandonEnCoursOuAccordé={abandonEnCoursOuAccordé}
        demandeRecours={demandeRecours}
        modificationsNonPermisesParLeCDCActuel={modificationsNonPermisesParLeCDCActuel}
        hasAttestationConformité={hasAttestationConformité}
        peutFaireDemandeChangementReprésentantLégal={peutFaireDemandeChangementReprésentantLégal}
        actionnaireMenu={actionnaireMenu}
      />
    )}
    {userIs(['dreal'])(user) && <DrealActions project={project} />}
  </div>
);

type ProjectStatus = 'non-notifié' | 'abandonné' | 'lauréat' | 'éliminé';
const getProjectStatus = (project: ProjectDataForProjectPage): ProjectStatus =>
  !project.notifiedOn
    ? 'non-notifié'
    : project.isAbandoned
      ? 'abandonné'
      : project.isClasse
        ? 'lauréat'
        : 'éliminé';
