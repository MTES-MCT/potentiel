import { FC } from 'react';
import { match } from 'ts-pattern';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';

export type TâcheListItemProps = PlainType<Lauréat.Tâche.ListerTâchesReadModel['items'][number]>;

export const TâcheListItem: FC<TâcheListItemProps> = ({
  identifiantProjet,
  nomProjet,
  miseÀJourLe,
  typeTâche,
}) => {
  const descriptionTâche = getDescriptionTâche(typeTâche, identifiantProjet, nomProjet);

  return (
    <ListItem
      miseÀJourLe={DateTime.bind(miseÀJourLe).formatter()}
      heading={
        <ProjectListItemHeading
          prefix="À faire pour le projet"
          identifiantProjet={IdentifiantProjet.bind(identifiantProjet)}
          nomProjet={nomProjet}
        />
      }
      actions={
        <Button
          linkProps={{
            href: descriptionTâche.lien,
            'aria-label': descriptionTâche.ariaLabel,
          }}
        >
          {descriptionTâche.action}
        </Button>
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
  const type = Lauréat.Tâche.TypeTâche.bind(typeTâche).type;
  const identifiant = IdentifiantProjet.bind(identifiantProjet).formatter();

  return match(type)
    .with('abandon.confirmer', () => ({
      titre: `Confirmer votre demande d'abandon`,
      description: `La DGEC vous demande de confirmer votre demande d'abandon.`,
      lien: Routes.Abandon.détailRedirection(identifiant),
      action: 'Voir la demande',
      ariaLabel: `Voir la demande de confirmation d'abandon pour le projet ${nomProjet}`,
    }))
    .with('abandon.transmettre-preuve-recandidature', () => ({
      titre: 'Transmettre votre preuve de recandidature',
      description: `Suite à l'accord de votre demande d'abandon avec recandidature convernant ce projet, vous devez sélectionner un de vos projet comme preuve avant l'échéance du 31 mars 2025.`,
      lien: Routes.Abandon.détailRedirection(identifiant),
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
      lien: Routes.Raccordement.détail(identifiant),
      action: 'Ajouter le gestionnaire de réseau',
      ariaLabel: `Ajouter le gestionnaire de réseau au projet ${nomProjet}`,
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
