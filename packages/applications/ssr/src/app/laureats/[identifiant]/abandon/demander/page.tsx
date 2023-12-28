import { mediator } from 'mediateur';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { redirect } from 'next/navigation';
import {
  DemanderAbandonPage,
  DemanderAbandonPageProps,
} from '@/components/pages/abandon/demander/DemanderAbandonPage';
import { CahierDesCharges } from '@potentiel-domain/laureat';
import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { NotFoundError } from '@potentiel-domain/core';
import { encodeParameter } from '@/utils/encodeParameter';

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'CONSULTER_CANDIDATURE_QUERY',
      data: {
        identifiantProjet,
      },
    });

    const appelOffres = await mediator.send<ConsulterAppelOffreQuery>({
      type: 'CONSULTER_APPEL_OFFRE_QUERY',
      data: { identifiantAppelOffre: candidature.appelOffre },
    });

    const { cahierDesChargesChoisi } =
      await mediator.send<CahierDesCharges.ConsulterCahierDesChargesChoisiQuery>({
        type: 'CONSULTER_CAHIER_DES_CHARGES_QUERY',
        data: {
          identifiantProjet,
        },
      });

    if (appelOffres.choisirNouveauCahierDesCharges && cahierDesChargesChoisi === 'initial') {
      redirect(`/projet/${encodeParameter(identifiantProjet)}/details.html`);
    }

    const période = appelOffres.periodes.find((p) => p.id === candidature.période);
    if (!période) {
      throw new NotFoundError('Période de notification introuvable');
    }

    // TODO: extract the logic in a dedicated function mapToProps
    // identifiantProjet must come from the readmodel as a value type
    const demanderAbandonPageProps: DemanderAbandonPageProps = {
      projet: { ...candidature, identifiantProjet },
      showRecandidatureCheckBox: période.abandonAvecRecandidature ? true : false,
    };

    return <DemanderAbandonPage {...{ ...demanderAbandonPageProps }} />;
  });
}
