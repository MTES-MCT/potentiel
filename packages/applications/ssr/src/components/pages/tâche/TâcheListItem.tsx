import Link from 'next/link';
import { FC } from 'react';
import { match } from 'ts-pattern';

import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { Tâche } from '@potentiel-domain/tache';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';

export type TâcheListItemProps = PlainType<Tâche.ListerTâchesReadModel['items'][number]>;

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
  const type = Tâche.TypeTâche.bind(typeTâche).type;
  const identifiant = IdentifiantProjet.bind(identifiantProjet).formatter();

  return match(type)
    .with('abandon.confirmer', () => ({
      titre: `Confirmer votre demande d'abandon`,
      description: `La DGEC vous demande de confirmer votre demande d'abandon.`,
      lien: Routes.Abandon.détail(identifiant),
      action: 'Voir la demande',
      ariaLabel: `Voir la demande de confirmation d'abandon pour le projet ${nomProjet}`,
    }))
    .with('abandon.transmettre-preuve-recandidature', () => ({
      titre: 'Transmettre votre preuve de recandidature',
      description: `Suite à l'accord de votre demande d'abandon avec recandidature convernant ce projet, vous devez sélectionner un de vos projet comme preuve avant l'échéance du 31 mars 2025.`,
      lien: Routes.Abandon.détail(identifiant),
      action: 'Transmettre',
      ariaLabel: `Transmettre votre preuve de recandidature pour le projet ${nomProjet}`,
    }))
    .with('raccordement.référence-non-transmise', () => ({
      titre: 'Référence non transmise',
      description: `La référence de votre dossier de raccordement n'a pas été transmise pour le projet ${nomProjet}`,
      lien: Routes.Raccordement.détail(identifiant),
      action: 'Voir le raccordement',
      ariaLabel: `Voir le raccordement du projet ${nomProjet}`,
    }))
    .with('raccordement.gestionnaire-réseau-inconnu-attribué', () => ({
      titre: 'Gestionnaire réseau inconnu',
      description: `Le gestionnaire réseau pour le projet ${nomProjet} n'a pas pu être automatiquement attribué.`,
      lien: Routes.Raccordement.modifierGestionnaireDeRéseau(identifiant),
      action: 'Modifier le gestionnaire réseau attribué',
      ariaLabel: `Modifier le gestionnaire réseau attribué au projet ${nomProjet}`,
    }))
    .with('garanties-financières.demander', () => ({
      titre: 'Garanties financières demandées',
      description: `Des garanties financières sont en attente pour ce projet`,
      lien: Routes.GarantiesFinancières.dépôt.soumettre(identifiant),
      action: 'Soumettre les garanties financières',
      ariaLabel: `Soumettre des garanties financières pour le projet ${nomProjet}`,
    }))
    .with('raccordement.renseigner-accusé-réception-demande-complète-raccordement', () => ({
      titre: "Document d'accusé de réception de la demande complète de raccordement manquant",
      description: `Le document d'accusé de réception de la demande complète de raccordement est manquant pour ce projet`,
      lien: Routes.Raccordement.détail(identifiant),
      action: 'Voir le raccordement',
      ariaLabel: `Voir le raccordement du projet ${nomProjet}`,
    }))
    .with('inconnue', () => ({
      titre: '',
      description: '',
      lien: '',
      action: '',
      ariaLabel: '',
    }))
    .exhaustive();
};
