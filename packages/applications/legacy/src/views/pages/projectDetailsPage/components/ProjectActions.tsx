import { Routes } from '@potentiel-applications/routes';
import React from 'react';

import {
  DropdownMenuSecondaryButton,
  PrimaryButton,
  PrintIcon,
  SecondaryLinkButton,
  DownloadLinkButton,
  LinkButton,
} from '../../../components';
import { ProjectHeaderProps } from './ProjectHeader';
import { Role } from '@potentiel-domain/utilisateur';

type Affichage = { labelActions?: string; url: string };
type ActionsProps = {
  actions: (Affichage | undefined)[];
  demandesDisabled?: true;
};

const Actions = ({ actions, demandesDisabled }: ActionsProps) => {
  const actionsWithLabel = actions.filter((action): action is Affichage => !!action?.labelActions);
  if (actionsWithLabel.length === 0) {
    return null;
  }
  return (
    <DropdownMenuSecondaryButton buttonChildren="Enregistrer une modification">
      {actionsWithLabel.map((modification, index) => (
        <DropdownMenuSecondaryButton.DropdownItem
          key={index}
          href={modification.url}
          disabled={demandesDisabled}
        >
          <span>{modification.labelActions}</span>
        </DropdownMenuSecondaryButton.DropdownItem>
      ))}
    </DropdownMenuSecondaryButton>
  );
};

type PorteurProjetActionsProps = Omit<ProjectActionsProps, 'user' | 'project'> & {
  identifiantProjet: string;
  doitAfficherAttestationDésignation: boolean;
};

const PorteurProjetActions = ({
  identifiantProjet,
  abandonEnCoursOuAccordé,
  doitAfficherAttestationDésignation,
  modificationsNonPermisesParLeCDCActuel,
  estAchevé,
  représentantLégalAffichage,
  actionnaireAffichage,
  puissanceAffichage,
  producteurAffichage,
  fournisseurAffichage,
  délaiAffichage,
  natureDeLExploitationAffichage,
  installateurAffichage,
  dispositifDeStockageAffichage,
  nomProjet,
}: PorteurProjetActionsProps) => {
  const demandesDisabled = modificationsNonPermisesParLeCDCActuel ? true : undefined;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col xl:flex-row gap-2">
        <Actions
          actions={[
            producteurAffichage,
            fournisseurAffichage,
            actionnaireAffichage,
            puissanceAffichage,
            représentantLégalAffichage,
            délaiAffichage,
            installateurAffichage,
            natureDeLExploitationAffichage,
            dispositifDeStockageAffichage,
            nomProjet.affichage,
            {
              labelActions:
                estAchevé || abandonEnCoursOuAccordé ? undefined : 'Demander un abandon',
              url: Routes.Abandon.demander(identifiantProjet),
            },
            {
              labelActions:
                estAchevé || abandonEnCoursOuAccordé
                  ? undefined
                  : "Transmettre l'attestation de conformité",
              url: Routes.Achèvement.transmettreAttestationConformité(identifiantProjet),
            },
          ]}
          demandesDisabled={demandesDisabled}
        />

        {!doitAfficherAttestationDésignation && (
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

type AdminActionsProps = ActionsProps & {
  identifiantProjet: string;
  estAchevé: boolean;
  doitAfficherAttestationDésignation: boolean;
};

const AdminActions = ({
  identifiantProjet,
  estAchevé,
  actions,
  doitAfficherAttestationDésignation,
}: AdminActionsProps) => (
  <div className="flex flex-col md:flex-row gap-2">
    <Actions
      actions={actions.concat({
        labelActions: estAchevé ? undefined : "Transmettre date d'achèvement",
        url: Routes.Achèvement.transmettreDateAchèvement(identifiantProjet),
      })}
    />

    <LinkButton href={Routes.Lauréat.modifier(identifiantProjet)}>Modifier le projet</LinkButton>

    {doitAfficherAttestationDésignation && (
      <DownloadLinkButton
        fileUrl={Routes.Candidature.téléchargerAttestation(identifiantProjet)}
        className="m-auto"
      >
        Voir attestation
      </DownloadLinkButton>
    )}

    <PrimaryButton className="m-auto inline-flex items-center" onClick={() => window.print()}>
      <PrintIcon className="text-white mr-2" aria-hidden />
      Imprimer la page
    </PrimaryButton>
  </div>
);

const DrealActions = ({ actions }: ActionsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <Actions actions={actions} />
      <PrimaryButton onClick={() => window.print()}>
        <PrintIcon className="text-white mr-2" aria-hidden />
        Imprimer la page
      </PrimaryButton>
    </div>
  );
};

type ProjectActionsProps = Omit<ProjectHeaderProps, 'statutLauréat' | 'project'>;

export const ProjectActions = ({
  identifiantProjet,
  user,
  abandonEnCoursOuAccordé,
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
  nomProjet,
  doitAfficherAttestationDésignation,
}: ProjectActionsProps) => {
  const role = Role.convertirEnValueType(user.role);

  return (
    <div className="print:hidden whitespace-nowrap">
      {role.estDGEC() && (
        <AdminActions
          identifiantProjet={identifiantProjet}
          estAchevé={estAchevé}
          doitAfficherAttestationDésignation={doitAfficherAttestationDésignation}
          actions={[
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
          ]}
        />
      )}
      {role.estPorteur() && (
        <PorteurProjetActions
          abandonEnCoursOuAccordé={abandonEnCoursOuAccordé}
          modificationsNonPermisesParLeCDCActuel={modificationsNonPermisesParLeCDCActuel}
          estAchevé={estAchevé}
          représentantLégalAffichage={représentantLégalAffichage}
          puissanceAffichage={puissanceAffichage}
          actionnaireAffichage={actionnaireAffichage}
          producteurAffichage={producteurAffichage}
          fournisseurAffichage={fournisseurAffichage}
          natureDeLExploitationAffichage={natureDeLExploitationAffichage}
          délaiAffichage={délaiAffichage}
          identifiantProjet={identifiantProjet}
          features={features}
          doitAfficherAttestationDésignation={doitAfficherAttestationDésignation}
          installateurAffichage={installateurAffichage}
          nomProjet={nomProjet}
          dispositifDeStockageAffichage={dispositifDeStockageAffichage}
        />
      )}
      {role.estDreal() && (
        <DrealActions
          actions={[
            producteurAffichage,
            puissanceAffichage,
            actionnaireAffichage,
            représentantLégalAffichage,
            siteDeProductionAffichage,
            fournisseurAffichage,
          ]}
        />
      )}
      {role.estCocontractant() && (
        <SecondaryLinkButton href={Routes.Achèvement.transmettreDateAchèvement(identifiantProjet)}>
          Transmettre la date d'achèvement
        </SecondaryLinkButton>
      )}
    </div>
  );
};
