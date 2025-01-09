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
} from '../../../components';
import { isActionnaireEnabled } from '@potentiel-applications/feature-flags';

type EnregistrerUneModificationProps = {
  project: ProjectDataForProjectPage;
};

const EnregistrerUneModification = ({ project }: EnregistrerUneModificationProps) => (
  <DropdownMenuSecondaryButton buttonChildren="Enregistrer une modification">
    <DropdownMenuSecondaryButton.DropdownItem
      href={routes.ADMIN_SIGNALER_DEMANDE_DELAI_PAGE(project.id)}
    >
      <span>Demande de délai</span>
    </DropdownMenuSecondaryButton.DropdownItem>
    <></>
  </DropdownMenuSecondaryButton>
);

type PorteurProjetActionsProps = {
  project: ProjectDataForProjectPage;
  abandonEnCours: boolean;
  demandeRecours: ProjectDataForProjectPage['demandeRecours'];
  modificationsNonPermisesParLeCDCActuel: boolean;
  hasAttestationConformité: boolean;
  peutFaireDemandeChangementReprésentantLégal: boolean;
  actionnaireMenu?: {
    label: string;
    url: string;
  };
};

const PorteurProjetActions = ({
  project,
  abandonEnCours,
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
            <DropdownMenuSecondaryButton.DropdownItem href={routes.DEMANDER_DELAI(project.id)}>
              <span>Demander un délai</span>
            </DropdownMenuSecondaryButton.DropdownItem>
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
            <DropdownMenuSecondaryButton.DropdownItem
              href={
                isActionnaireEnabled() && actionnaireMenu
                  ? actionnaireMenu.url
                  : routes.CHANGER_ACTIONNAIRE(project.id)
              }
            >
              <span>
                {isActionnaireEnabled() && actionnaireMenu
                  ? actionnaireMenu.label
                  : "Changer l'actionaire"}
              </span>
            </DropdownMenuSecondaryButton.DropdownItem>
            <DropdownMenuSecondaryButton.DropdownItem
              href={routes.DEMANDER_CHANGEMENT_PUISSANCE(project.id)}
            >
              <span>
                Changer de{' '}
                {project.appelOffre.typeAppelOffre === 'biométhane'
                  ? `production annuelle prévisionnelle`
                  : `puissance`}
              </span>
            </DropdownMenuSecondaryButton.DropdownItem>
            {!abandonEnCours && (
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
            {peutFaireDemandeChangementReprésentantLégal && (
              <DropdownMenuSecondaryButton.DropdownItem
                href={Routes.ReprésentantLégal.changement.demander(identifiantProjet)}
              >
                <span>Demander un changement de représentant légal</span>
              </DropdownMenuSecondaryButton.DropdownItem>
            )}
          </DropdownMenuSecondaryButton>
        )}

        {project.notifiedOn && (
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
const AdminActions = ({ project }: AdminActionsProps) => {
  const identifiantProjet = formatProjectDataToIdentifiantProjetValueType({
    appelOffreId: project.appelOffreId,
    periodeId: project.periodeId,
    familleId: project.familleId,
    numeroCRE: project.numeroCRE,
  }).formatter();

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <EnregistrerUneModification {...{ project }} />
      {project.notifiedOn ? (
        <DownloadLinkButton
          fileUrl={Routes.Candidature.téléchargerAttestation(identifiantProjet)}
          className="m-auto"
        >
          Voir attestation
        </DownloadLinkButton>
      ) : !project.isLegacy ? (
        <PreviewLinkButton
          fileUrl={Routes.Candidature.prévisualiserAttestation(identifiantProjet)}
          className="m-auto"
        >
          Aperçu attestation
        </PreviewLinkButton>
      ) : null}
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
      <EnregistrerUneModification project={project} />
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
  abandonEnCours: boolean;
  demandeRecours: ProjectDataForProjectPage['demandeRecours'];
  modificationsNonPermisesParLeCDCActuel: boolean;
  hasAttestationConformité: boolean;
  peutFaireDemandeChangementReprésentantLégal: boolean;
  actionnaireMenu?: {
    label: string;
    url: string;
  };
};

export const ProjectActions = ({
  project,
  user,
  abandonEnCours,
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
        abandonEnCours={abandonEnCours}
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
