import { z } from 'zod';
import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { match } from 'ts-pattern';

import { Role } from '@potentiel-domain/utilisateur';
import { Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  HistoriqueLauréatAction,
  HistoriqueLauréatPage,
} from '@/components/pages/lauréat/historique/HistoriqueLauréat.page';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';
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

const categoriesDisponibles = [
  'abandon',
  'achevement',
  'actionnaire',
  'garanties-financieres',
  'lauréat',
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

      const candidature = await getCandidature(identifiantProjet);

      const historique = await mediator.send<Lauréat.ListerHistoriqueProjetQuery>({
        type: 'Lauréat.Query.ListerHistoriqueProjet',
        data: {
          identifiantProjet,
          category: categorie,
        },
      });

      return (
        <HistoriqueLauréatPage
          identifiantProjet={identifiantProjet}
          actions={mapToActions(utilisateur.role)}
          filters={[
            {
              label: 'Categorie',
              searchParamKey: 'categorie',
              options: categoriesDisponibles.map((categorie) => ({
                label: categorie.replace('-', ' '),
                value: categorie,
              })),
            },
          ]}
          historique={historique.items
            .filter((historique) => !historique.type.includes('Import'))
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((item) => mapToTimelineItemProps(item, candidature.unitéPuissance.formatter()))
            .filter((item) => item !== undefined)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
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
  producteur: 'ri-draft-line',
  puissance: 'ri-draft-line',
  raccordement: 'ri-plug-line',
  recours: 'ri-scales-3-line',
};

const mapToTimelineItemProps = (
  readmodel: Lauréat.HistoriqueListItemReadModels,
  unitéPuissance: string,
) => {
  const props = match(readmodel)
    .returnType<TimelineItemProps | undefined>()
    .with(
      {
        category: 'abandon',
      },
      mapToAbandonTimelineItemProps,
    )
    .with(
      {
        category: 'recours',
      },
      mapToRecoursTimelineItemProps,
    )
    .with({ category: 'actionnaire' }, mapToActionnaireTimelineItemProps)
    .with({ category: 'représentant-légal' }, mapToReprésentantLégalTimelineItemProps)
    .with({ category: 'lauréat' }, mapToLauréatTimelineItemProps)
    .with({ category: 'garanties-financieres' }, mapToGarantiesFinancièresTimelineItemProps)
    .with({ category: 'producteur' }, mapToProducteurTimelineItemProps)
    .with({ category: 'puissance' }, (readmodel) =>
      mapToPuissanceTimelineItemProps(readmodel, unitéPuissance),
    )
    .with({ category: 'achevement' }, mapToAchèvementTimelineItemProps)
    .with({ category: 'raccordement' }, mapToRaccordementTimelineItemProps)
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
