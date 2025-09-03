import { z } from 'zod';
import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { match } from 'ts-pattern';

import { Role } from '@potentiel-domain/utilisateur';
import { Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToProducteurTimelineItemProps } from '@/utils/historique/mapToProps/producteur/mapToProducteurTimelineItemProps';
import { TimelineItemProps } from '@/components/organisms/Timeline';
import { mapToAbandonTimelineItemProps } from '@/utils/historique/mapToProps/abandon/mapToAbandonTimelineItemProps';
import { mapToAchèvementTimelineItemProps } from '@/utils/historique/mapToProps/achèvement/mapToAchèvementTimelineItemProps';
import { mapToActionnaireTimelineItemProps } from '@/utils/historique/mapToProps/actionnaire/mapToActionnaireTimelineItemProps';
import { mapToGarantiesFinancièresTimelineItemProps } from '@/utils/historique/mapToProps/garanties-financières/mapToGarantiesFinancièresTimelineItemProps';
import { mapToLauréatTimelineItemProps } from '@/utils/historique/mapToProps/lauréat/mapToLauréatTimelineItemProps';
import { mapToRaccordementTimelineItemProps } from '@/utils/historique/mapToProps/raccordement/mapToRaccordementTimelineItemProps';
import { mapToRecoursTimelineItemProps } from '@/utils/historique/mapToProps/recours/mapToRecoursTimelineItemProps';
import { mapToReprésentantLégalTimelineItemProps } from '@/utils/historique/mapToProps/représentant-légal/mapToReprésentantLégalTimelineItemProps';
import { mapToPuissanceTimelineItemProps } from '@/utils/historique/mapToProps/puissance';
import { IconProps } from '@/components/atoms/Icon';
import { mapToDélaiTimelineItemProps } from '@/utils/historique/mapToProps/délai/mapToDélaiTimelineItemProps';
import { mapToÉliminéTimelineItemProps } from '@/utils/historique/mapToProps/éliminé';

import { getLauréatInfos } from '../_helpers/getLauréat';
import { mapToFournisseurTimelineItemProps } from '../../../../utils/historique/mapToProps/fournisseur';

import { HistoriqueLauréatAction, HistoriqueLauréatPage } from './HistoriqueLauréat.page';

const categoriesDisponibles = [
  'abandon',
  'achevement',
  'actionnaire',
  'délai',
  'fournisseur',
  'garanties-financieres',
  'lauréat',
  'éliminé',
  'producteur',
  'puissance',
  'recours',
  'représentant-légal',
  'raccordement',
] as const;

type PageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Historique du projet',
  description: 'Historique du projet',
};

const paramsSchema = z.object({
  categorie: z.enum(categoriesDisponibles).optional(),
});

export default async function Page({ params: { identifiant }, searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);
      const { categorie } = paramsSchema.parse(searchParams);

      const lauréat = await getLauréatInfos({ identifiantProjet });

      const historique = await mediator.send<Lauréat.ListerHistoriqueProjetQuery>({
        type: 'Lauréat.Query.ListerHistoriqueProjet',
        data: {
          identifiantProjet,
          category: categorie,
        },
      });

      const options = categoriesDisponibles
        .map((categorie) => ({
          label: categorie.charAt(0).toUpperCase() + categorie.slice(1).replace('-', ' '),
          value: categorie,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'fr'));

      const historiqueFilteredAndSorted = historique.items
        .filter((historique) => !historique.type.includes('Import'))
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map((item) => mapToTimelineItemProps(item, lauréat.unitéPuissance.formatter()))
        .filter((item) => item !== undefined)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return (
        <HistoriqueLauréatPage
          identifiantProjet={identifiantProjet}
          actions={mapToActions(utilisateur.role)}
          filters={[
            {
              label: 'Categorie',
              searchParamKey: 'categorie',
              options,
            },
          ]}
          historique={historiqueFilteredAndSorted}
        />
      );
    }),
  );
}

const mapToActions = (rôle: Role.ValueType) => {
  const actions: Array<HistoriqueLauréatAction> = [];

  if (rôle.aLaPermission('historique.imprimer')) {
    actions.push('imprimer');
  }

  return actions;
};

const categoryToIconProps: Record<(typeof categoriesDisponibles)[number], IconProps['id']> = {
  'garanties-financieres': 'ri-bank-line',
  'représentant-légal': 'ri-draft-line',
  abandon: 'ri-draft-line',
  achevement: 'ri-verified-badge-line',
  actionnaire: 'ri-draft-line',
  lauréat: 'ri-notification-3-line',
  éliminé: 'ri-notification-3-line',
  producteur: 'ri-draft-line',
  puissance: 'ri-draft-line',
  raccordement: 'ri-plug-line',
  recours: 'ri-scales-3-line',
  délai: 'ri-time-line',
  fournisseur: 'ri-draft-line',
};

const mapToTimelineItemProps = (
  readmodel: Lauréat.HistoriqueListItemReadModels,
  unitéPuissance: string,
) => {
  const props = match(readmodel)
    .returnType<TimelineItemProps | undefined>()
    .with({ category: 'abandon' }, mapToAbandonTimelineItemProps)
    .with({ category: 'recours' }, mapToRecoursTimelineItemProps)
    .with({ category: 'actionnaire' }, mapToActionnaireTimelineItemProps)
    .with({ category: 'représentant-légal' }, mapToReprésentantLégalTimelineItemProps)
    .with({ category: 'lauréat' }, mapToLauréatTimelineItemProps)
    .with({ category: 'éliminé' }, mapToÉliminéTimelineItemProps)
    .with({ category: 'garanties-financieres' }, mapToGarantiesFinancièresTimelineItemProps)
    .with({ category: 'producteur' }, mapToProducteurTimelineItemProps)
    .with({ category: 'puissance' }, (readmodel) =>
      mapToPuissanceTimelineItemProps(readmodel, unitéPuissance),
    )
    .with({ category: 'achevement' }, mapToAchèvementTimelineItemProps)
    .with({ category: 'raccordement' }, mapToRaccordementTimelineItemProps)
    .with({ category: 'délai' }, mapToDélaiTimelineItemProps)
    .with({ category: 'fournisseur' }, mapToFournisseurTimelineItemProps)
    .exhaustive(() => undefined);
  if (props) {
    return {
      ...props,
      icon: props.icon ?? {
        id: categoryToIconProps[readmodel.category],
      },
    };
  }
};
