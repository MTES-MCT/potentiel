import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

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
};

export const mapToTimelineItemProps = ({
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
