import { mapToPlainObject, type PlainType } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';

import { getDescriptionTâche } from '@/app/taches/TâcheListItem';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { Heading3 } from '@/components/atoms/headings';
import { SectionPage } from '@/components/atoms/section/SectionPage';
import { ListItem } from '@/components/molecules/ListItem';
import { Tile } from '@/components/organisms/Tile';

type Props = {
  tâches: PlainType<Lauréat.Tâche.ListerTâchesReadModel>;
  utilisateurEstPorteur: boolean;
};

export const TâchesPage = ({ tâches, utilisateurEstPorteur }: Props) => (
  <SectionPage title={utilisateurEstPorteur ? 'Tâches' : 'Tâches porteur'}>
    <TâchesList tâches={tâches} utilisateurEstPorteur={utilisateurEstPorteur} />
  </SectionPage>
);

const TâchesList = ({ tâches, utilisateurEstPorteur }: Props) => {
  if (tâches.items.length === 0) {
    return <span>Aucune tâche à afficher</span>;
  }
  return (
    <ul className="flex flex-col gap-3">
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
                  heading={<Heading3 as="h2">{titre}</Heading3>}
                  actions={null}
                >
                  <div className="lex flex flex-col gap-2">
                    <p>{description}</p>
                    {utilisateurEstPorteur && (
                      <TertiaryLink href={lien} aria-label={ariaLabel}>
                        {action}
                      </TertiaryLink>
                    )}
                  </div>
                </ListItem>
              </Tile>
            </li>
          );
        })}
    </ul>
  );
};
