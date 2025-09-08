import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export class InstallateurWorld {
  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    installateurALaCandidature: string | undefined,
  ) {
    if (!installateurALaCandidature) {
      return Option.none;
    }

    const expected: Lauréat.Installateur.ConsulterInstallateurReadModel = {
      identifiantProjet,
      installateur: installateurALaCandidature,
    };

    return expected;
  }
}
