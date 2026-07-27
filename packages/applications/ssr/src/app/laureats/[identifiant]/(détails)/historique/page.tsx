import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { match, P } from 'ts-pattern';
import { z } from 'zod';

import type { HistoryRecord } from '@potentiel-domain/entity';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';

import { getLauréatInfos } from '@/app/_helpers';
import { mapToÉliminéTimelineItemProps } from '@/app/elimines/[identifiant]/(historique)/mapToÉliminéTimelineItemProps';
import { mapToRecoursTimelineItemProps } from '@/app/elimines/[identifiant]/recours/(historique)/mapToRecoursTimelineItemProps';
import type { TimelineItemProps } from '@/components/organisms/timeline';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToLauréatTimelineItemProps } from '../../(historique)/mapToLauréatTimelineItemProps';
import { mapToAbandonTimelineItemProps } from '../../abandon/(historique)/mapToAbandonTimelineItemProps';
import { mapToAchèvementTimelineItemProps } from '../../achevement/(historique)/mapToAchèvementTimelineItemProps';
import { mapToActionnaireTimelineItemProps } from '../../actionnaire/(historique)/mapToActionnaireTimelineItemProps';
import { mapToDélaiTimelineItemProps } from '../../delai/(historique)/mapToDélaiTimelineItemProps';
import { mapToFournisseurTimelineItemProps } from '../../fournisseur/(historique)/mapToFournisseurTimelineItemProps';
import { mapToGarantiesFinancièresTimelineItemProps } from '../../garanties-financieres/(historique)/mapToGarantiesFinancièresTimelineItemProps';
import { mapToInstallationTimelineItemProps } from '../../installation/(historique)/mapToInstallationTimelineItemProps';
import { mapToNatureDeLExploitationTimelineItemProps } from '../../nature-de-l-exploitation/(historique)/mapToNatureDeLExploitationTimelineItemProps';
import { mapToPowerPurchaseAgreementTimelineItemProps } from '../../power-purchase-agreement/(historique)/mapToPowerPurchaseAgreementTimelineItemProps';
import { mapToProducteurTimelineItemProps } from '../../producteur/(historique)/mapToProducteurTimelineItemProps';
import { mapToPuissanceTimelineItemProps } from '../../puissance/(historique)/mapToPuissanceTimelineItemProps';
import { mapToRaccordementTimelineItemProps } from '../../raccordements/(historique)/mapToRaccordementTimelineItemProps';
import { mapToReprésentantLégalTimelineItemProps } from '../../representant-legal/(historique)/mapToReprésentantLégalTimelineItemProps';
import {
  categoriesDisponibles,
  mapCatégorieToIcon,
  mapCatégorieToLabel,
} from './_helpers/catégories';
import { type HistoriqueLauréatAction, HistoriqueLauréatPage } from './HistoriqueLauréat.page';

type PageProps = IdentifiantParameter & {
  searchParams?: Promise<Record<string, string>>;
};

export const metadata: Metadata = { title: 'Historique' };

const paramsSchema = z.object({
  categorie: z.enum(categoriesDisponibles).optional(),
});

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);
      const { categorie } = paramsSchema.parse(searchParams);

      const lauréat = await getLauréatInfos(
        IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
      );

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
          .with({ type: P.union('RecoursAccordé-V1', 'RecoursAccordé-V2') }, () => true)
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

      const catégories = categoriesDisponibles
        .map((categorie) => ({
          label: mapCatégorieToLabel(categorie),
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
          actions={mapToActions(utilisateur.rôle)}
          catégories={catégories}
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
    .with({ type: 'ChangementNomProjetEnregistré-V1' }, () => false)
    .with({ type: 'StatutLauréatModifié-V1' }, () => false)
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
      mapToPuissanceTimelineItemProps({
        event: readmodel,
        unitéPuissance,
      }),
    )
    .with({ category: 'achevement' }, mapToAchèvementTimelineItemProps)
    .with({ category: 'raccordement' }, mapToRaccordementTimelineItemProps)
    .with({ category: 'délai' }, mapToDélaiTimelineItemProps)
    .with({ category: 'fournisseur' }, mapToFournisseurTimelineItemProps)
    .with({ category: 'installation' }, mapToInstallationTimelineItemProps)
    .with(
      {
        category: 'nature-de-l-exploitation',
      },
      mapToNatureDeLExploitationTimelineItemProps,
    )
    .with({ category: 'power-purchase-agreement' }, mapToPowerPurchaseAgreementTimelineItemProps)
    .exhaustive(() => undefined);

  if (props) {
    return {
      ...props,
      icon: props.icon ?? {
        id: mapCatégorieToIcon(readmodel.category),
      },
    };
  }
};
