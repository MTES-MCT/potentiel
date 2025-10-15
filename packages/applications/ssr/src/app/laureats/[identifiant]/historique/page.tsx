import { z } from 'zod';
import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { match, P } from 'ts-pattern';

import { Role } from '@potentiel-domain/utilisateur';
import { Lauréat } from '@potentiel-domain/projet';
import { HistoryRecord } from '@potentiel-domain/entity';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { TimelineItemProps } from '@/components/organisms/Timeline';
import { IconProps } from '@/components/atoms/Icon';
import { mapToRecoursTimelineItemProps } from '@/app/elimine/[identifiant]/recours/(historique)/mapToRecoursTimelineItemProps';
import { mapToÉliminéTimelineItemProps } from '@/app/elimine/[identifiant]/(historique)/mapToÉliminéTimelineItemProps';

import { getLauréatInfos } from '../_helpers/getLauréat';
import { mapToAchèvementTimelineItemProps } from '../achevement/(historique)/mapToAchèvementTimelineItemProps';
import { mapToActionnaireTimelineItemProps } from '../actionnaire/(historique)/mapToActionnaireTimelineItemProps';
import { mapToReprésentantLégalTimelineItemProps } from '../representant-legal/(historique)/mapToReprésentantLégalTimelineItemProps';
import { mapToLauréatTimelineItemProps } from '../(historique)/mapToLauréatTimelineItemProps';
import { mapToGarantiesFinancièresTimelineItemProps } from '../garanties-financieres/(historique)/mapToGarantiesFinancièresTimelineItemProps';
import { mapToProducteurTimelineItemProps } from '../producteur/(historique)/mapToProducteurTimelineItemProps';
import { mapToPuissanceTimelineItemProps } from '../puissance/(historique)';
import { mapToAbandonTimelineItemProps } from '../abandon/(historique)/mapToAbandonTimelineItemProps';
import { mapToRaccordementTimelineItemProps } from '../raccordements/(historique)/mapToRaccordementTimelineItemProps';
import { mapToDélaiTimelineItemProps } from '../delai/(historique)/mapToDélaiTimelineItemProps';
import { mapToInstallateurTimelineItemProps } from '../installateur/(historique)/mapToInstallateurTimelineItemProps';
import { mapToNatureDeLExploitationTimelineItemProps } from '../nature-de-l-exploitation/(historique)/mapToNatureDeLExploitationTimelineItemProps';
import { mapToFournisseurTimelineItemProps } from '../fournisseur/(historique)/mapToFournisseurTimelineItemProps';
import { mapToDispositifDeStockageProps } from '../dispositif-de-stockage/(historique)/mapToDispositifDeStockageTimelineItemProps';

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
  'installateur',
  'dispositif-de-stockage',
  'nature-de-l-exploitation',
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

      const aUnRecoursAccordé = !!historique.items.find((item) => {
        if (item.category !== 'recours') {
          return false;
        }

        return match(item)
          .returnType<boolean>()
          .with({ type: 'RecoursAccordé-V1' }, () => true)
          .with(
            {
              type: P.union(
                'RecoursDemandé-V1',
                'RecoursAnnulé-V1',
                'RecoursPasséEnInstruction-V1',
                'RecoursRejeté-V1',
              ),
            },
            () => false,
          )
          .exhaustive();
      });

      const doitAfficherLienAttestationDésignation =
        !aUnRecoursAccordé && !!lauréat.attestationDésignation;

      const options = categoriesDisponibles
        .map((categorie) => ({
          label: categorie.charAt(0).toUpperCase() + categorie.slice(1).replace('-', ' '),
          value: categorie,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'fr'));

      const historiqueFilteredAndSorted = historique.items
        .filter(filtrerImportsEtRecoursLegacy)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map((item) =>
          mapToTimelineItemProps({
            readmodel: item,
            unitéPuissance: lauréat.unitéPuissance.formatter(),
            doitAfficherLienAttestationDésignation,
          }),
        )
        .filter((item) => item !== undefined)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return (
        <HistoriqueLauréatPage
          identifiantProjet={identifiantProjet}
          actions={mapToActions(utilisateur.role)}
          filters={[
            {
              label: 'Catégorie',
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

const DEMANDE_GENERIQUE_ICONE = 'ri-draft-line';

const categoryToIconProps: Record<(typeof categoriesDisponibles)[number], IconProps['id']> = {
  'garanties-financieres': 'ri-bank-line',
  'représentant-légal': DEMANDE_GENERIQUE_ICONE,
  abandon: 'ri-logout-box-line',
  achevement: 'ri-verified-badge-line',
  actionnaire: DEMANDE_GENERIQUE_ICONE,
  lauréat: 'ri-notification-3-line',
  éliminé: 'ri-notification-3-line',
  producteur: DEMANDE_GENERIQUE_ICONE,
  puissance: 'ri-flashlight-line',
  raccordement: 'ri-plug-line',
  recours: 'ri-scales-3-line',
  délai: 'ri-time-line',
  fournisseur: DEMANDE_GENERIQUE_ICONE,
  installateur: DEMANDE_GENERIQUE_ICONE,
  'dispositif-de-stockage': DEMANDE_GENERIQUE_ICONE,
  'nature-de-l-exploitation': DEMANDE_GENERIQUE_ICONE,
};

const filtrerImportsEtRecoursLegacy = (
  event: Lauréat.HistoriqueListItemReadModels,
  _: number,
  historique: Readonly<Lauréat.HistoriqueListItemReadModels[]>,
) => {
  // on ne veut pas afficher dans l'historique complet les événements d'import de chaque domaine
  // qui arrive en rebond de la désignation
  if (event.type?.includes('Import')) {
    return false;
  }
  // dans de rares cas de projets désignés hors Potentiel,
  // on a pas l'information de la date de notification du projetÉliminé
  // on préfère alors ne pas l'information fausse de la notification de l'éliminé
  if (event.category === 'éliminé' && event.type === 'ÉliminéNotifié-V1') {
    const lauréatNotifié = historique.find(isLauréatNotifié);
    if (lauréatNotifié && lauréatNotifié.payload.notifiéLe === event.payload.notifiéLe) {
      return false;
    }
  }
  return true;
};

const isLauréatNotifié = (
  item: Lauréat.HistoriqueListItemReadModels,
): item is HistoryRecord<
  'lauréat',
  Lauréat.LauréatNotifiéEvent | Lauréat.LauréatNotifiéV1Event
> => {
  if (item.category !== 'lauréat') {
    return false;
  }
  return match(item)
    .with({ type: 'LauréatNotifié-V1' }, () => true)
    .with({ type: 'LauréatNotifié-V2' }, () => true)
    .with({ type: 'CahierDesChargesChoisi-V1' }, () => false)
    .with({ type: 'NomProjetModifié-V1' }, () => false)
    .with({ type: 'SiteDeProductionModifié-V1' }, () => false)
    .with({ type: 'NomEtLocalitéLauréatImportés-V1' }, () => false)
    .exhaustive();
};

type MapToTimelineItemProps = {
  readmodel: Lauréat.HistoriqueListItemReadModels;
  unitéPuissance: string;
  doitAfficherLienAttestationDésignation: boolean;
};

const mapToTimelineItemProps = ({
  readmodel,
  unitéPuissance,
  doitAfficherLienAttestationDésignation,
}: MapToTimelineItemProps) => {
  const props = match(readmodel)
    .returnType<TimelineItemProps | undefined>()
    .with({ category: 'abandon' }, mapToAbandonTimelineItemProps)
    .with({ category: 'recours' }, mapToRecoursTimelineItemProps)
    .with({ category: 'actionnaire' }, mapToActionnaireTimelineItemProps)
    .with({ category: 'représentant-légal' }, mapToReprésentantLégalTimelineItemProps)
    .with({ category: 'lauréat' }, (readmodel) =>
      mapToLauréatTimelineItemProps({
        readmodel,
        doitAfficherLienAttestationDésignation,
      }),
    )
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
    .with({ category: 'installateur' }, mapToInstallateurTimelineItemProps)
    .with(
      {
        category: 'dispositif-de-stockage',
      },
      mapToDispositifDeStockageProps,
    )
    .with(
      {
        category: 'nature-de-l-exploitation',
      },
      mapToNatureDeLExploitationTimelineItemProps,
    )
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
