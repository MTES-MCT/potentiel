import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { ChoisirCahierDesChargesPage } from '@/components/pages/lauréat/choisirCahierDesCharges/ChoisirCahierDesCharges.page';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';
import { getCahierDesCharges } from '@/app/_helpers/getCahierDesCharges';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export const metadata: Metadata = {
  title: 'Choix du Cahier des Charges - Potentiel',
  description: 'Choix du Cahier des Charges',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));
    const { appelOffres, période } = await getPériodeAppelOffres(identifiantProjet);
    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

    const délai = await mediator.send<Lauréat.Délai.ConsulterDélaiQuery>({
      type: 'Lauréat.Délai.Query.ConsulterDélai',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    return (
      <ChoisirCahierDesChargesPage
        identifiantProjet={identifiantProjet.formatter()}
        appelOffres={mapToPlainObject(appelOffres)}
        cahierDesCharges={mapToPlainObject(cahierDesCharges)}
        cahiersDesChargesDisponibles={[
          {
            label:
              'Instruction selon les dispositions du cahier des charges en vigueur au moment de la candidature',
            value: 'initial',
            disabled: !appelOffres.doitPouvoirChoisirCDCInitial,
            descriptions: période.choisirNouveauCahierDesCharges
              ? [
                  'Je dois envoyer ma demande ou mon signalement au format papier.',
                  "Je pourrai changer de mode d'instruction lors de ma prochaine demande si je le souhaite.",
                ]
              : [],
          },
          ...période.cahiersDesChargesModifiésDisponibles.map((cdc) => ({
            label: `Instruction selon le cahier des charges${cdc.alternatif ? ' alternatif' : ''} modifié rétroactivement et publié le ${cdc.paruLe}.`,
            value: AppelOffre.RéférenceCahierDesCharges.bind(cdc).formatter(),
            descriptions: [
              "Ce choix s'appliquera à toutes les futures demandes faites sous Potentiel.",
            ].concat(
              cdc.paruLe === '30/07/2021'
                ? [
                    "Une modification ultérieure pourra toujours être instruite selon le cahier des charges en vigueur au moment du dépôt de l'offre, à condition qu'elle soit soumise au format papier en précisant ce choix.",
                  ]
                : [],
            ),
          })),
        ]}
        aBénéficiéDuDélaiCDC2022={Option.isSome(délai) && délai.aBénéficiéDuDélaiCDC2022}
      />
    );
  });
}
