import Link from 'next/link';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { ListerTâchesReadModel, TypeTâche } from '@potentiel-domain/tache';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';

export type TâcheListItemProps = PlainType<ListerTâchesReadModel['items'][number]>;

export const TâcheListItem: FC<TâcheListItemProps> = ({
  identifiantProjet,
  nomProjet,
  misÀJourLe,
  typeTâche,
}) => {
  const descriptionTâche = getDescriptionTâche(typeTâche, identifiantProjet, nomProjet);

  return (
    <ListItem
      heading={
        <ProjectListItemHeading
          prefix="À faire pour le projet"
          identifiantProjet={IdentifiantProjet.bind(identifiantProjet)}
          nomProjet={nomProjet}
          misÀJourLe={DateTime.bind(misÀJourLe).formatter()}
        />
      }
      actions={
        <Link href={descriptionTâche.lien} aria-label={descriptionTâche.ariaLabel}>
          {descriptionTâche.action}
        </Link>
      }
    >
      <h3 className="font-bold">{descriptionTâche.titre}</h3>
      <p className="m-0 text-sm">{descriptionTâche.description}</p>
    </ListItem>
  );
};

const getDescriptionTâche = (
  typeTâche: TâcheListItemProps['typeTâche'],
  identifiantProjet: TâcheListItemProps['identifiantProjet'],
  nomProjet: string,
) => {
  const type = TypeTâche.bind(typeTâche).type;
  const identifiant = IdentifiantProjet.bind(identifiantProjet).formatter();
  switch (type) {
    case 'abandon.confirmer':
      return {
        titre: `Confirmer votre demande d'abandon`,
        description: `La DGEC vous demande de confirmer votre demande d'abandon.`,
        lien: Routes.Abandon.détail(identifiant),
        action: 'Voir la demande',
        ariaLabel: `Voir la demande de confirmation d'abandon pour le projet ${nomProjet}`,
      };
    case 'abandon.transmettre-preuve-recandidature':
      return {
        titre: 'Transmettre votre preuve de recandidature',
        description: `Suite à l'accord de votre demande d'abandon avec recandidature convernant ce projet, vous devez sélectionner un de vos projet comme preuve avant l'échéance du 31 mars 2025.`,
        lien: Routes.Abandon.transmettrePreuveRecandidature(identifiant),
        action: 'Transmettre',
        ariaLabel: `Transmettre votre preuve de recandidature pour le projet ${nomProjet}`,
      };
    case 'raccordement.référence-non-transmise':
      return {
        titre: 'Référence non transmise',
        description: `La référence de votre dossier de raccordement n'a pas été transmise pour le projet ${nomProjet}`,
        lien: Routes.Raccordement.détail(identifiant),
        action: 'Voir le raccordement',
        ariaLabel: `Voir le raccordement du projet ${nomProjet}`,
      };
    case 'raccordement.gestionnaire-réseau-inconnu-attribué':
      return {
        titre: 'Gestionnaire réseau inconnu',
        description: `Le gestionnaire réseau pour le projet ${nomProjet} n'a pas pu être automatiquement attribué.`,
        lien: Routes.Raccordement.modifierGestionnaireDeRéseau(identifiant),
        action: 'Modifier le gestionnaire réseau attribué',
        ariaLabel: `Modifier le gestionnaire réseau attribué au projet ${nomProjet}`,
      };
    case 'garanties-financières.demander':
      return {
        titre: 'Garanties financières demandées',
        description: `Des garanties financières sont en attente pour ce projet`,
        lien: Routes.GarantiesFinancières.dépôt.soumettre(identifiant),
        action: 'Soumettre les garanties financières',
        ariaLabel: `Soumettre des garanties financières pour le projet ${nomProjet}`,
      };
    default: {
      return {
        titre: '',
        description: '',
        lien: '',
        action: '',
        aria: '',
      };
    }
  }
};
