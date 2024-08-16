import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';

export type CandidatureListItemProps = PlainType<
  Candidature.ListerCandidaturesReadModel['items'][number]
>;

export const CandidatureListItem: FC<CandidatureListItemProps> = () => {
  // const { nom, appelOffre, période, famille } = Option.match(projet)
  //   .some((some) => some)
  //   .none(() => ({
  //     appelOffre: 'N/A',
  //     famille: Option.none,
  //     nom: 'Projet inconnu',
  //     numéroCRE: 'N/A',
  //     période: 'N/A',
  //   }));

  // const descriptionCandidature = getDescriptionCandidature(typeCandidature, identifiantProjet, nom);
  // const dateMiseÀJourLe = DateTime.bind(misÀJourLe);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col gap-1">
        <h2 className="leading-4">
          <span className="font-bold"></span>
        </h2>
        {/* <div className="flex flex-col md:flex-row gap-2 md:gap-0 italic text-xs">
          <div>
            Appel d'offres : {appelOffre}
            <span className="hidden md:inline-block mr-2">,</span>
          </div>
          <div>Période : {période}</div>
          {Option.isSome(famille) && (
            <div>
              <span className="hidden md:inline-block mr-2">,</span>
              Famille :{famille}
            </div>
          )}
        </div> */}
      </div>
      {/* <div className="flex flex-col gap-1">
        <h3 className="font-bold">{descriptionCandidature.titre}</h3>
        <p className="m-0 text-sm">{descriptionCandidature.description}</p>
      </div>
      <p className="italic text-xs">
        dernière mise à jour le <FormattedDate date={dateMiseÀJourLe.formatter()} />
      </p>
      <Link
        href={descriptionCandidature.lien}
        className="self-center mt-4 md:self-end md:mt-0"
        aria-label={descriptionCandidature.ariaLabel}
      >
        {descriptionCandidature.action}
      </Link> */}
    </div>
  );
};
