import { Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject, PlainType } from '@potentiel-domain/core';

import { getDescriptionTâche } from '@/app/taches/TâcheListItem';
import { Tile } from '@/components/organisms/Tile';
import { ListItem } from '@/components/molecules/ListItem';
import { Heading3 } from '@/components/atoms/headings';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { SectionPage } from '../(components)/SectionPage';

type Props = {
  tâches: PlainType<Lauréat.Tâche.ListerTâchesReadModel>;
};

export const TâchesPage = ({ tâches }: Props) => (
  <SectionPage title="Actions en attente">
    <TâchesList tâches={tâches} />
  </SectionPage>
);

const TâchesList = ({ tâches }: Props) => {
  return (
    <>
      {tâches.items.length === 0 ? (
        <span>Aucune tâche à afficher</span>
      ) : (
        <ul className="flex flex-col gap-3 w-3/4">
          {mapToPlainObject(tâches.items)
            .map(({ typeTâche, identifiantProjet, miseÀJourLe, nomProjet }) => ({
              ...getDescriptionTâche(typeTâche, identifiantProjet, nomProjet),
              miseÀJourLe,
            }))
            .map(({ action, ariaLabel, description, lien, titre, miseÀJourLe }) => {
              return (
                <li key={titre}>
                  <Tile className="flex flex-col md:flex-row md:justify-between">
                    <ListItem
                      miseÀJourLe={miseÀJourLe.date}
                      heading={<Heading3>{titre}</Heading3>}
                      actions={<></>}
                    >
                      <div className="lex flex flex-col gap-2">
                        <p>{description}</p>
                        <TertiaryLink href={lien} aria-label={ariaLabel}>
                          {action}
                        </TertiaryLink>
                      </div>
                    </ListItem>
                  </Tile>
                </li>
              );
            })}
        </ul>
      )}
    </>
  );
};
