import { mediator } from 'mediateur';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';

export const getDateAchèvementPrévisionnel = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  dateAchèvementLegacy: number,
) => {
  if (!Lauréat.Délai.isFonctionnalitéDélaiActivée()) {
    return dateAchèvementLegacy;
  }

  const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
    type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  return Option.match(achèvement)
    .some((achèvement) => achèvement.dateAchèvementPrévisionnel.dateTime.date.getTime())
    .none(() => dateAchèvementLegacy);
};
