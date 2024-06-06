import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from '@potentiel-domain/candidature';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { ConsulterMainlevéeGarantiesFinancièresReadModel } from '@potentiel-domain/laureat/src/garantiesFinancières';
import { AppelOffre, ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { projetSoumisAuxGarantiesFinancières } from '@/utils/garanties-financières/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { ProjetNonSoumisAuxGarantiesFinancièresPage } from '@/components/pages/garanties-financières/ProjetNonSoumisAuxGarantiesFinancières.page';
import {
  InstruireDemandeMainlevéeGarantiesFinancières,
  InstruireDemandeMainlevéeGarantiesFinancièresProps,
} from '@/components/pages/garanties-financières/mainlevée/instruire/InstruireDemandeMainlevéeGarantiesFinancièresActuelles.page';

export const metadata: Metadata = {
  title: 'Instruire une demande de mainlevée - Potentiel',
  description: `Page d'instruction d'une demande de mainlevée de garanties financières`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: { identifiantProjet },
    });

    const appelOffreDetails = await mediator.send<ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: candidature.appelOffre },
    });

    const projet = { ...candidature, identifiantProjet };

    const soumisAuxGarantiesFinancières = await projetSoumisAuxGarantiesFinancières({
      appelOffre: candidature.appelOffre,
      famille: candidature.famille,
      periode: candidature.période,
    });

    if (!soumisAuxGarantiesFinancières) {
      return <ProjetNonSoumisAuxGarantiesFinancièresPage projet={projet} />;
    }

    const demandeMainlevée =
      await mediator.send<GarantiesFinancières.ConsulterMainlevéeGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter',
        data: { identifiantProjetValue: identifiantProjet },
      });

    if (Option.isNone(demandeMainlevée)) {
      return notFound();
    }

    const props = mapToProps({ ...demandeMainlevée, projet, appelOffreDetails });

    return <InstruireDemandeMainlevéeGarantiesFinancières {...props} />;
  });
}

const mapToProps = ({
  projet,
  statut,
  appelOffreDetails,
}: ConsulterMainlevéeGarantiesFinancièresReadModel & {
  projet: ConsulterCandidatureReadModel & { identifiantProjet: string };
  appelOffreDetails: AppelOffre;
}): InstruireDemandeMainlevéeGarantiesFinancièresProps => ({
  projet,
  mainlevée: { statut: statut.statut },
  urlAppelOffre: appelOffreDetails.cahiersDesChargesUrl,
});
