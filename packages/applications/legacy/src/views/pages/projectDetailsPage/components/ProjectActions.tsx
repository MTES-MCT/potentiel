import { Routes } from '@potentiel-applications/routes';
import React from 'react';
import { ProjectDataForProjectPage } from '../../../../modules/project';
import { userIs } from '../../../../modules/users';
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
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../../helpers/dataToValueTypes';
import { ProjectHeaderProps } from './ProjectHeader';

type EnregistrerUneModificationProps = Pick<
  ProjectHeaderProps,
  | 'producteurAffichage'
  | 'puissanceAffichage'
  | 'actionnaireAffichage'
  | 'représentantLégalAffichage'
  | 'délaiAffichage'
  | 'fournisseurAffichage'
  | 'installateurAffichage'
  | 'typologieInstallationAffichage'
  | 'dispositifDeStockageAffichage'
  | 'natureDeLExploitationAffichage'
  | 'siteDeProductionAffichage'
>;

const EnregistrerUneModification = ({
  producteurAffichage,
  puissanceAffichage,
  actionnaireAffichage,
  représentantLégalAffichage,
  délaiAffichage,
  fournisseurAffichage,
  installateurAffichage,
  typologieInstallationAffichage,
  dispositifDeStockageAffichage,
  natureDeLExploitationAffichage,
  siteDeProductionAffichage,
}: EnregistrerUneModificationProps) => {
  return (
    <DropdownMenuSecondaryButton buttonChildren="Enregistrer une modification">
      {!!producteurAffichage?.labelActions && (
        <DropdownMenuSecondaryButton.DropdownItem href={producteurAffichage.url}>
          <span>{producteurAffichage.labelActions}</span>
        </DropdownMenuSecondaryButton.DropdownItem>
      )}
      {!!puissanceAffichage?.labelActions && (
        <DropdownMenuSecondaryButton.DropdownItem href={puissanceAffichage.url}>
          <span>{puissanceAffichage.labelActions}</span>
        </DropdownMenuSecondaryButton.DropdownItem>
      )}
      {!!actionnaireAffichage?.labelActions && (
        <DropdownMenuSecondaryButton.DropdownItem href={actionnaireAffichage.url}>
          <span>{actionnaireAffichage.labelActions}</span>
        </DropdownMenuSecondaryButton.DropdownItem>
      )}
      {!!représentantLégalAffichage?.labelActions && (
        <DropdownMenuSecondaryButton.DropdownItem href={représentantLégalAffichage.url}>
          <span>{représentantLégalAffichage.labelActions}</span>
        </DropdownMenuSecondaryButton.DropdownItem>
      )}
      {!!délaiAffichage?.labelActions && (
        <DropdownMenuSecondaryButton.DropdownItem href={délaiAffichage.url}>
          <span>{délaiAffichage.labelActions}</span>
        </DropdownMenuSecondaryButton.DropdownItem>
      )}
      {!!fournisseurAffichage?.labelActions && (
        <DropdownMenuSecondaryButton.DropdownItem href={fournisseurAffichage.url}>
          <span>{fournisseurAffichage.labelActions}</span>
        </DropdownMenuSecondaryButton.DropdownItem>
      )}
      {!!installateurAffichage?.labelActions && (
        <DropdownMenuSecondaryButton.DropdownItem href={installateurAffichage.url}>
          <span>{installateurAffichage.labelActions}</span>
        </DropdownMenuSecondaryButton.DropdownItem>
      )}
      {!!typologieInstallationAffichage?.labelActions && (
        <DropdownMenuSecondaryButton.DropdownItem href={typologieInstallationAffichage.url}>
          <span>{typologieInstallationAffichage.labelActions}</span>
        </DropdownMenuSecondaryButton.DropdownItem>
      )}
      {!!dispositifDeStockageAffichage?.labelActions && (
        <DropdownMenuSecondaryButton.DropdownItem href={dispositifDeStockageAffichage.url}>
          <span>{dispositifDeStockageAffichage.labelActions}</span>
        </DropdownMenuSecondaryButton.DropdownItem>
      )}
      {!!natureDeLExploitationAffichage?.labelActions && (
        <DropdownMenuSecondaryButton.DropdownItem href={natureDeLExploitationAffichage.url}>
          <span>{natureDeLExploitationAffichage.labelActions}</span>
        </DropdownMenuSecondaryButton.DropdownItem>
      )}
      {!!siteDeProductionAffichage?.labelActions && (
        <DropdownMenuSecondaryButton.DropdownItem href={siteDeProductionAffichage.url}>
          <span>{siteDeProductionAffichage.labelActions}</span>
        </DropdownMenuSecondaryButton.DropdownItem>
      )}
    </DropdownMenuSecondaryButton>
  );
};

type PorteurProjetActionsProps = Omit<ProjectActionsProps, 'user'> & {
  identifiantProjet: IdentifiantProjet.RawType;
};

const PorteurProjetActions = ({
  identifiantProjet,
  project,
  abandonEnCoursOuAccordé,
  demandeRecours,
  modificationsNonPermisesParLeCDCActuel,
  estAchevé,
  représentantLégalAffichage,
  actionnaireAffichage,
  puissanceAffichage,
  producteurAffichage,
  fournisseurAffichage,
  délaiAffichage,
}: PorteurProjetActionsProps) => {
  const peutDemanderAbandonOuAchèvement = !abandonEnCoursOuAccordé && !estAchevé;
  const demandesDisabled = modificationsNonPermisesParLeCDCActuel ? true : undefined;

  const auMoinsUneActionDisponible =
    producteurAffichage ||
    fournisseurAffichage ||
    actionnaireAffichage ||
    puissanceAffichage ||
    représentantLégalAffichage ||
    délaiAffichage ||
    peutDemanderAbandonOuAchèvement;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col xl:flex-row gap-2">
        {!project.isClasse && !demandeRecours && (
          <SecondaryLinkButton
            href={Routes.Recours.demander(identifiantProjet)}
            disabled={demandesDisabled}
          >
            Faire une demande de recours
          </SecondaryLinkButton>
        )}

        {project.isClasse && auMoinsUneActionDisponible && (
          <DropdownMenuSecondaryButton buttonChildren="Actions" className="w-fit">
            {!!producteurAffichage && (
              <DropdownMenuSecondaryButton.DropdownItem
                href={producteurAffichage.url}
                disabled={demandesDisabled}
              >
                <span>{producteurAffichage.labelActions}</span>
              </DropdownMenuSecondaryButton.DropdownItem>
            )}
            {!!fournisseurAffichage && (
              <DropdownMenuSecondaryButton.DropdownItem
                href={fournisseurAffichage.url}
                disabled={demandesDisabled}
              >
                <span>{fournisseurAffichage.labelActions ?? fournisseurAffichage.label}</span>
              </DropdownMenuSecondaryButton.DropdownItem>
            )}
            {!!actionnaireAffichage && (
              <DropdownMenuSecondaryButton.DropdownItem
                href={actionnaireAffichage.url}
                disabled={demandesDisabled}
              >
                <span>{actionnaireAffichage.labelActions}</span>
              </DropdownMenuSecondaryButton.DropdownItem>
            )}
            {!!puissanceAffichage && (
              <DropdownMenuSecondaryButton.DropdownItem
                href={puissanceAffichage.url}
                disabled={demandesDisabled}
              >
                <span>{puissanceAffichage.labelActions ?? puissanceAffichage.label}</span>
              </DropdownMenuSecondaryButton.DropdownItem>
            )}
            {!!représentantLégalAffichage && (
              <DropdownMenuSecondaryButton.DropdownItem
                href={représentantLégalAffichage.url}
                disabled={demandesDisabled}
              >
                <span>{représentantLégalAffichage.labelActions}</span>
              </DropdownMenuSecondaryButton.DropdownItem>
            )}
            {!!délaiAffichage && (
              <DropdownMenuSecondaryButton.DropdownItem
                href={délaiAffichage.url}
                disabled={demandesDisabled}
              >
                <span>{délaiAffichage.label ?? délaiAffichage.labelActions}</span>
              </DropdownMenuSecondaryButton.DropdownItem>
            )}
            {peutDemanderAbandonOuAchèvement && (
              <>
                <DropdownMenuSecondaryButton.DropdownItem
                  href={Routes.Abandon.demander(identifiantProjet)}
                  disabled={demandesDisabled}
                >
                  <span>Demander un abandon</span>
                </DropdownMenuSecondaryButton.DropdownItem>
                {!estAchevé && getProjectStatus(project) === 'lauréat' && (
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

type AdminActionsProps = EnregistrerUneModificationProps & {
  project: ProjectDataForProjectPage;
  identifiantProjet: IdentifiantProjet.RawType;
  doitAfficherAttestationDésignation: boolean;
};

const AdminActions = ({
  project: { notifiedOn, isLegacy, isClasse },
  identifiantProjet,
  producteurAffichage,
  puissanceAffichage,
  actionnaireAffichage,
  représentantLégalAffichage,
  délaiAffichage,
  fournisseurAffichage,
  installateurAffichage,
  typologieInstallationAffichage,
  dispositifDeStockageAffichage,
  natureDeLExploitationAffichage,
  siteDeProductionAffichage,
  doitAfficherAttestationDésignation,
}: AdminActionsProps) => (
  <div className="flex flex-col md:flex-row gap-2">
    {isClasse && (
      <EnregistrerUneModification
        producteurAffichage={producteurAffichage}
        puissanceAffichage={puissanceAffichage}
        actionnaireAffichage={actionnaireAffichage}
        représentantLégalAffichage={représentantLégalAffichage}
        délaiAffichage={délaiAffichage}
        fournisseurAffichage={fournisseurAffichage}
        installateurAffichage={installateurAffichage}
        typologieInstallationAffichage={typologieInstallationAffichage}
        dispositifDeStockageAffichage={dispositifDeStockageAffichage}
        natureDeLExploitationAffichage={natureDeLExploitationAffichage}
        siteDeProductionAffichage={siteDeProductionAffichage}
      />
    )}
    {notifiedOn && isClasse ? (
      <LinkButton href={Routes.Lauréat.modifier(identifiantProjet)}>Modifier le projet</LinkButton>
    ) : (
      <LinkButton href={Routes.Candidature.corriger(identifiantProjet)}>
        Modifier la candidature
      </LinkButton>
    )}
    {match({
      notifiedOn: !!notifiedOn,
      doitAfficherAttestationDésignation,
    })
      .with({ notifiedOn: true, doitAfficherAttestationDésignation: true }, () => (
        <DownloadLinkButton
          fileUrl={Routes.Candidature.téléchargerAttestation(identifiantProjet)}
          className="m-auto"
        >
          Voir attestation
        </DownloadLinkButton>
      ))
      .with({ notifiedOn: false }, () => (
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

type DrealActionsProps = Pick<
  ProjectHeaderProps,
  | 'project'
  | 'puissanceAffichage'
  | 'actionnaireAffichage'
  | 'représentantLégalAffichage'
  | 'producteurAffichage'
  | 'fournisseurAffichage'
  | 'siteDeProductionAffichage'
>;

const DrealActions = ({
  project: { isClasse },
  représentantLégalAffichage,
  puissanceAffichage,
  actionnaireAffichage,
  producteurAffichage,
  siteDeProductionAffichage,
  fournisseurAffichage,
}: DrealActionsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-2">
      {isClasse && (
        <EnregistrerUneModification
          producteurAffichage={producteurAffichage}
          puissanceAffichage={puissanceAffichage}
          actionnaireAffichage={actionnaireAffichage}
          représentantLégalAffichage={représentantLégalAffichage}
          siteDeProductionAffichage={siteDeProductionAffichage}
          fournisseurAffichage={fournisseurAffichage}
        />
      )}
      <PrimaryButton onClick={() => window.print()}>
        <PrintIcon className="text-white mr-2" aria-hidden />
        Imprimer la page
      </PrimaryButton>
    </div>
  );
};

type ProjectActionsProps = Omit<ProjectHeaderProps, 'statutLauréat'>;

export const ProjectActions = ({
  project,
  user,
  abandonEnCoursOuAccordé,
  demandeRecours,
  modificationsNonPermisesParLeCDCActuel,
  estAchevé,
  représentantLégalAffichage,
  puissanceAffichage,
  actionnaireAffichage,
  producteurAffichage,
  fournisseurAffichage,
  délaiAffichage,
  installateurAffichage,
  typologieInstallationAffichage,
  features,
  dispositifDeStockageAffichage,
  natureDeLExploitationAffichage,
  siteDeProductionAffichage,
  doitAfficherAttestationDésignation,
}: ProjectActionsProps) => {
  const identifiantProjet = formatProjectDataToIdentifiantProjetValueType({
    appelOffreId: project.appelOffreId,
    periodeId: project.periodeId,
    familleId: project.familleId,
    numeroCRE: project.numeroCRE,
  }).formatter();

  return (
    <div className="print:hidden whitespace-nowrap">
      {userIs(['admin', 'dgec-validateur'])(user) && (
        <AdminActions
          project={project}
          identifiantProjet={identifiantProjet}
          producteurAffichage={producteurAffichage}
          puissanceAffichage={puissanceAffichage}
          actionnaireAffichage={actionnaireAffichage}
          représentantLégalAffichage={représentantLégalAffichage}
          délaiAffichage={délaiAffichage}
          fournisseurAffichage={fournisseurAffichage}
          installateurAffichage={installateurAffichage}
          typologieInstallationAffichage={typologieInstallationAffichage}
          dispositifDeStockageAffichage={dispositifDeStockageAffichage}
          natureDeLExploitationAffichage={natureDeLExploitationAffichage}
          siteDeProductionAffichage={siteDeProductionAffichage}
          doitAfficherAttestationDésignation={doitAfficherAttestationDésignation}
        />
      )}
      {userIs(['porteur-projet'])(user) && (
        <PorteurProjetActions
          project={project}
          abandonEnCoursOuAccordé={abandonEnCoursOuAccordé}
          demandeRecours={demandeRecours}
          modificationsNonPermisesParLeCDCActuel={modificationsNonPermisesParLeCDCActuel}
          estAchevé={estAchevé}
          représentantLégalAffichage={représentantLégalAffichage}
          puissanceAffichage={puissanceAffichage}
          actionnaireAffichage={actionnaireAffichage}
          producteurAffichage={producteurAffichage}
          fournisseurAffichage={fournisseurAffichage}
          délaiAffichage={délaiAffichage}
          identifiantProjet={identifiantProjet}
          features={features}
          doitAfficherAttestationDésignation={doitAfficherAttestationDésignation}
        />
      )}
      {userIs(['dreal'])(user) && (
        <DrealActions
          project={project}
          producteurAffichage={producteurAffichage}
          puissanceAffichage={puissanceAffichage}
          actionnaireAffichage={actionnaireAffichage}
          représentantLégalAffichage={représentantLégalAffichage}
          siteDeProductionAffichage={siteDeProductionAffichage}
          fournisseurAffichage={fournisseurAffichage}
        />
      )}
    </div>
  );
};

type ProjectStatus = 'non-notifié' | 'abandonné' | 'lauréat' | 'éliminé';
const getProjectStatus = (project: ProjectDataForProjectPage): ProjectStatus =>
  !project.notifiedOn
    ? 'non-notifié'
    : project.isAbandoned
      ? 'abandonné'
      : project.isClasse
        ? 'lauréat'
        : 'éliminé';
