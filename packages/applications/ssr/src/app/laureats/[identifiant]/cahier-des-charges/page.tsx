import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { getCahierDesCharges } from '@/app/_helpers';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { ChoisirCahierDesChargesPage } from './ChoisirCahierDesCharges.page';

export const metadata: Metadata = {
  title: 'Choix du Cahier des Charges - Potentiel',
  description: 'Choix du Cahier des Charges',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));
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
        cahierDesCharges={mapToPlainObject(cahierDesCharges)}
        cahiersDesChargesDisponibles={[
          {
            label:
              'Instruction selon les dispositions du cahier des charges en vigueur au moment de la candidature',
            value: 'initial',
            disabled: !cahierDesCharges.appelOffre.doitPouvoirChoisirCDCInitial,
            descriptions: cahierDesCharges.doitChoisirUnCahierDesChargesModificatif()
              ? [
                  'Je dois envoyer ma demande ou mon signalement au format papier.',
                  "Je pourrai changer de mode d'instruction lors de ma prochaine demande si je le souhaite.",
                ]
              : [],
          },
          ...cahierDesCharges.période.cahiersDesChargesModifiésDisponibles.map((cdc) => ({
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
