import Link from 'next/link';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { ListerTâchesReadModel, TypeTâche } from '@potentiel-domain/tache';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export type TâcheListItemProps = PlainType<ListerTâchesReadModel['items'][number]>;

export const TâcheListItem: FC<TâcheListItemProps> = ({
  identifiantProjet,
  projet,
  misÀJourLe,
  typeTâche,
}) => {
  const { nom, appelOffre, période, famille } = Option.match(projet)
    .some((some) => some)
    .none(() => ({
      appelOffre: 'N/A',
      famille: Option.none,
      nom: 'Projet inconnu',
      numéroCRE: 'N/A',
      période: 'N/A',
    }));

  const descriptionTâche = getDescriptionTâche(typeTâche, identifiantProjet, nom);
  const dateMiseÀJourLe = DateTime.bind(misÀJourLe);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col gap-1">
        <h2 className="leading-4">
          À faire pour le projet : <span className="font-bold">{nom}</span>
        </h2>
        <div className="flex flex-col md:flex-row gap-2 md:gap-0 italic text-xs">
          <div>
            Appel d'offres : {appelOffre}
            <span className="hidden md:inline-block mr-2">,</span>
          </div>
          <div>Période : {période}</div>
          <div>
            <span className="hidden md:inline-block mr-2">,</span>
            Famille :{' '}
            {Option.match(famille)
              .some((value) => value)
              .none(() => 'N/A')}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold">{descriptionTâche.titre}</h3>
        <p className="m-0 text-sm">{descriptionTâche.description}</p>
      </div>
      <p className="italic text-xs">
        dernière mise à jour le <FormattedDate date={dateMiseÀJourLe.formatter()} />
      </p>
      <Link
        href={descriptionTâche.lien}
        className="self-center mt-4 md:self-end md:mt-0"
        aria-label={descriptionTâche.ariaLabel}
      >
        {descriptionTâche.action}
      </Link>
    </div>
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
