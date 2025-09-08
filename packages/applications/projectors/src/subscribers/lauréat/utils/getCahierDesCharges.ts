import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet, CahierDesCharges, Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

export const getCahierDesCharges = async (
  identifiantProjet: IdentifiantProjet.ValueType,
): Promise<CahierDesCharges.ValueType | undefined> => {
  const lauréat = await findProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {});

  const appelOffres = await findProjection<AppelOffre.AppelOffreEntity>(
    `appel-offre|${identifiantProjet.appelOffre}`,
  );

  if (Option.isNone(appelOffres) || Option.isNone(lauréat)) {
    return undefined;
  }

  const période = appelOffres.periodes.find((periode) => periode.id === identifiantProjet.période);

  if (!période) {
    return undefined;
  }

  const famille = période.familles?.find((famille) => famille.id === identifiantProjet.famille);

  const cahierDesChargesChoisi = AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(
    lauréat.cahierDesCharges,
  );

  const cahierDesChargesModificatif = période.cahiersDesChargesModifiésDisponibles.find((c) =>
    cahierDesChargesChoisi.estÉgaleÀ(AppelOffre.RéférenceCahierDesCharges.bind(c)),
  );

  return CahierDesCharges.bind({
    appelOffre: appelOffres,
    période,
    famille,
    cahierDesChargesModificatif,
    technologie: undefined,
  });
};
