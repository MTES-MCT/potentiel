import { Option } from '@potentiel-libraries/monads';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { récupérerLauréat } from '@/app/_helpers';

import { getAchèvement, getGarantiesFinancières } from '../../../_helpers';

import { DemanderMainlevéePage, DemanderMainlevéePageProps } from './DemanderMainlevée.page';

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async () => {
      const identifiantProjet = decodeParameter(identifiant);
      const lauréat = await récupérerLauréat(identifiantProjet);

      const { actuelles, dépôt } = await getGarantiesFinancières(
        lauréat.identifiantProjet.formatter(),
      );

      const achèvement = await getAchèvement(lauréat.identifiantProjet.formatter());

      const prérequis: DemanderMainlevéePageProps['prérequis'] = {
        garantiesFinancièresValidées: !!actuelles?.statut.estValidé(),
        attestationConstitutionTransmise: !!actuelles?.document,
        pasDeDépôtEnCours: !dépôt,
        projetAchevéOuAbandonné: lauréat.statut.estAbandonné() || lauréat.statut.estAchevé(),
        attestationConformitéTransmise: achèvement.estAchevé
          ? Option.isSome(achèvement.attestation)
          : undefined,
      };

      return (
        <DemanderMainlevéePage
          identifiantProjet={identifiantProjet}
          motif={lauréat.statut.estAchevé() ? 'projet-achevé' : 'projet-abandonné'}
          prérequis={prérequis}
          prérequisComplétés={Object.values(prérequis).every((prérequis) => prérequis)}
        />
      );
    }),
  );
}
