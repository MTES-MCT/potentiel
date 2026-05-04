import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Joined } from '@potentiel-domain/entity';

import { Candidature, CahierDesCharges } from '../../index.js';

type Props = {
  identifiantPériode: string;
  identifiantFamille?: string;
  référenceCDC: AppelOffre.RéférenceCahierDesCharges.RawType;
  appelOffre: Joined<AppelOffre.AppelOffreEntity>['appel-offre'];
  coefficientKChoisi: Candidature.Dépôt.ValueType['coefficientKChoisi'];
  technologie: AppelOffre.Technologie | undefined;
};

export const getCoefficientKLauréat = ({
  identifiantPériode,
  identifiantFamille,
  référenceCDC,
  appelOffre,
  coefficientKChoisi,
  technologie,
}: Props) => {
  const période = appelOffre.periodes.find((p) => p.id === identifiantPériode);

  if (!période) {
    return coefficientKChoisi;
  }

  const famille = période.familles?.find((famille) => famille.id === identifiantFamille);

  const cahierDesChargesChoisi =
    AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(référenceCDC);

  const cahierDesChargesModificatif = période.cahiersDesChargesModifiésDisponibles.find((c) =>
    cahierDesChargesChoisi.estÉgaleÀ(AppelOffre.RéférenceCahierDesCharges.bind(c)),
  );

  const cdc = CahierDesCharges.bind({
    appelOffre,
    période,
    famille,
    cahierDesChargesModificatif,
    technologie,
  });

  const règlesCoefficientKChoisi = cdc.getChampsSupplémentaires()?.coefficientKChoisi;

  return règlesCoefficientKChoisi?.type === 'défaut'
    ? règlesCoefficientKChoisi.valeur
    : coefficientKChoisi;
};
