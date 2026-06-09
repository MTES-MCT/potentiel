import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { type CahierDesCharges, IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { getCahierDesCharges } from '@/app/_helpers';
import { vérifierProjetSoumisAuxGarantiesFinancières } from '@/app/laureats/[identifiant]/garanties-financieres/_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { récuperérerGarantiesFinancièresActuelles } from '../../_helpers/récupérerGarantiesFinancièresActuelles';
import { typesGarantiesFinancièresPourFormulaire } from '../../typesGarantiesFinancièresPourFormulaire';
import {
  ModifierGarantiesFinancièresActuellesPage,
  type ModifierGarantiesFinancièresActuellesPageProps,
} from './ModifierGarantiesFinancièresActuelles.page';

export const metadata: Metadata = { title: 'Modifier les garanties financières actuelles' };

export default async function Page(props0: IdentifiantParameter) {
  const params = await props0.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.GarantiesFinancières.ModifierGarantiesFinancièresUseCase>(
        'Lauréat.GarantiesFinancières.UseCase.ModifierGarantiesFinancières',
      );

      const identifiantProjetValue = decodeParameter(identifiant);
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());
      await vérifierProjetSoumisAuxGarantiesFinancières(identifiantProjet);

      const garantiesFinancières = await récuperérerGarantiesFinancièresActuelles(
        identifiantProjet.formatter(),
      );

      if (Option.isNone(garantiesFinancières)) {
        return notFound();
      }

      const props = mapToProps(garantiesFinancières, cahierDesCharges);

      return (
        <ModifierGarantiesFinancièresActuellesPage
          typesGarantiesFinancières={props.typesGarantiesFinancières}
          actuelles={props.actuelles}
        />
      );
    }),
  );
}

type MapToProps = (
  garantiesFinancières: Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresActuellesReadModel,
  cahierDesCharges: CahierDesCharges.ValueType,
) => ModifierGarantiesFinancièresActuellesPageProps;

const mapToProps: MapToProps = (garantiesFinancières, cahierDesCharges) => ({
  typesGarantiesFinancières: typesGarantiesFinancièresPourFormulaire(cahierDesCharges),
  actuelles: mapToPlainObject(garantiesFinancières),
});
