import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import { mapToÉliminéTimelineItemProps } from '@/app/elimines/[identifiant]/(historique)/mapToÉliminéTimelineItemProps';
import { mapToRecoursTimelineItemProps } from '@/app/elimines/[identifiant]/recours/(historique)/mapToRecoursTimelineItemProps';
import type { TimelineItemProps } from '@/components/organisms/timeline/TimelineItem';
import { mapToLauréatTimelineItemProps } from '../../../(historique)/mapToLauréatTimelineItemProps';
import { mapToAbandonTimelineItemProps } from '../../../abandon/(historique)/mapToAbandonTimelineItemProps';
import { mapToAchèvementTimelineItemProps } from '../../../achevement/(historique)/mapToAchèvementTimelineItemProps';
import { mapToActionnaireTimelineItemProps } from '../../../actionnaire/(historique)/mapToActionnaireTimelineItemProps';
import { mapToDélaiTimelineItemProps } from '../../../delai/(historique)/mapToDélaiTimelineItemProps';
import { mapToFournisseurTimelineItemProps } from '../../../fournisseur/(historique)/mapToFournisseurTimelineItemProps';
import { mapToInstallationTimelineItemProps } from '../../../installation/(historique)/mapToInstallationTimelineItemProps';
import { mapToNatureDeLExploitationTimelineItemProps } from '../../../nature-de-l-exploitation/(historique)/mapToNatureDeLExploitationTimelineItemProps';
import { mapToPowerPurchaseAgreementTimelineItemProps } from '../../../power-purchase-agreement/(historique)/mapToPowerPurchaseAgreementTimelineItemProps';
import { mapToProducteurTimelineItemProps } from '../../../producteur/(historique)/mapToProducteurTimelineItemProps';
import { mapToPuissanceTimelineItemProps } from '../../../puissance/(historique)/mapToPuissanceTimelineItemProps';
import { mapToReprésentantLégalTimelineItemProps } from '../../../representant-legal/(historique)/mapToReprésentantLégalTimelineItemProps';
import { mapToGarantiesFinancièresTimelineItemProps } from '../../garanties-financieres/(historique)/mapToGarantiesFinancièresTimelineItemProps';
import { mapToRaccordementTimelineItemProps } from '../../raccordements/(historique)/mapToRaccordementTimelineItemProps';
import { mapCatégorieToIcon } from './catégories';

type MapToTimelineItemProps = {
  readmodel: Lauréat.HistoriqueListItemReadModels;
  unitéPuissance: string;
  doitAfficherLienAttestationDésignation: boolean;
  rôleUtilisateur: Utilisateur.ValueType['rôle'];
};

export const mapToTimelineItemProps = ({
  readmodel,
  unitéPuissance,
  doitAfficherLienAttestationDésignation,
  rôleUtilisateur,
}: MapToTimelineItemProps) => {
  const props = match(readmodel)
    .returnType<TimelineItemProps | undefined>()
    .with({ category: 'abandon' }, (readmodel) =>
      mapToAbandonTimelineItemProps(readmodel, rôleUtilisateur),
    )
    .with({ category: 'recours' }, (readmodel) =>
      mapToRecoursTimelineItemProps(readmodel, rôleUtilisateur),
    )
    .with({ category: 'actionnaire' }, (readmodel) =>
      mapToActionnaireTimelineItemProps(readmodel, rôleUtilisateur),
    )
    .with({ category: 'représentant-légal' }, (readmodel) =>
      mapToReprésentantLégalTimelineItemProps(readmodel, rôleUtilisateur),
    )
    .with({ category: 'lauréat' }, (readmodel) =>
      mapToLauréatTimelineItemProps({
        readmodel,
        doitAfficherLienAttestationDésignation,
        rôleUtilisateur,
      }),
    )
    .with({ category: 'éliminé' }, mapToÉliminéTimelineItemProps)
    .with({ category: 'garanties-financieres' }, mapToGarantiesFinancièresTimelineItemProps)
    .with({ category: 'producteur' }, (readmodel) =>
      mapToProducteurTimelineItemProps(readmodel, rôleUtilisateur),
    )
    .with({ category: 'puissance' }, (readmodel) =>
      mapToPuissanceTimelineItemProps({
        event: readmodel,
        unitéPuissance,
        rôleUtilisateur,
      }),
    )
    .with({ category: 'achevement' }, mapToAchèvementTimelineItemProps)
    .with({ category: 'raccordement' }, mapToRaccordementTimelineItemProps)
    .with({ category: 'délai' }, (readmodel) =>
      mapToDélaiTimelineItemProps(readmodel, rôleUtilisateur),
    )
    .with({ category: 'fournisseur' }, (readmodel) =>
      mapToFournisseurTimelineItemProps(readmodel, rôleUtilisateur),
    )
    .with({ category: 'installation' }, (readmodel) =>
      mapToInstallationTimelineItemProps(readmodel, rôleUtilisateur),
    )
    .with(
      {
        category: 'nature-de-l-exploitation',
      },
      (readmodel) => mapToNatureDeLExploitationTimelineItemProps(readmodel, rôleUtilisateur),
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
