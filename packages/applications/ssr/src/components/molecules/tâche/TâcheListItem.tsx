import { FC } from 'react';
import { encodeParameter } from '@/utils/encodeParameter';

type TâcheListItemProps = {
  identifiantProjet: string;
  nomProjet: string;
  appelOffre: string;
  période: string;
  famille?: string;
  misÀJourLe: string;
  typeTâche: string;
};

export const TâcheListItem: FC<TâcheListItemProps> = ({
  identifiantProjet,
  nomProjet,
  appelOffre,
  période,
  famille,
  misÀJourLe,
  typeTâche,
}) => {
  const descriptionTâche = getDescriptionTâche(typeTâche, identifiantProjet);

  return (
    <>
      <div>
        <div className="flex flex-col gap-1">
          <h2 className="leading-4">
            À faire pour le projet : <span className="font-bold">{nomProjet}</span>
          </h2>
          <div className="flex flex-col md:flex-row gap-2 md:gap-0 italic text-xs">
            <div>
              Appel d'offres : {appelOffre}
              <span className="hidden md:inline-block mr-2">,</span>
            </div>
            <div>Période : {période}</div>
            {famille && (
              <div>
                <span className="hidden md:inline-block mr-2">,</span>
                Famille : {famille}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-3">
          <h3>{descriptionTâche.titre}</h3>
          <p className="m-0">{descriptionTâche.description}</p>
        </div>
      </div>
      <div className="flex flex-col justify-between mt-4 md:mt-2">
        <p className="italic text-sm">dernière mise à jour le {misÀJourLe}</p>
        <a
          href={descriptionTâche.lien}
          className="self-end mt-2"
          aria-label={descriptionTâche.aria}
        >
          {descriptionTâche.action}
        </a>
      </div>
    </>
  );
};

const getDescriptionTâche = (typeTâche: string, identifiantProjet: string) => {
  switch (typeTâche) {
    case 'abandon.confirmer':
      return {
        titre: `Confirmer votre demande d'abandon`,
        description: `La DGEC vous demande de confirmer votre demande d'abandon.`,
        lien: `/laureat/${encodeParameter(identifiantProjet)}/abandon`,
        action: 'Voir la demande',
        aria: `Voir la demande de confirmation d'abandon`,
      };
    case 'abandon.transmettre-preuve-recandidature':
      return {
        titre: 'Transmettre votre preuve de recandidature',
        description: `Suite à l'accord de votre demande d'abandon avec recandidature convernant ce projet, vous devez sélectionner un de vos projet comme preuve avant l'échéance du 31 mars 2025.`,
        lien: `/laureat/${encodeParameter(
          identifiantProjet,
        )}/abandon/transmettre-preuve-recandidature`,
        action: 'Transmettre',
        aria: `Transmettre votre preuve de recandidature`,
      };
  }

  return {
    titre: '',
    description: '',
    lien: '',
    action: '',
    aria: '',
  };
};
