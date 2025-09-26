import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import {
  ChoisirCahierDesChargesForm,
  ChoisirCahierDesChargesFormProps,
} from './ChoisirCahierDesCharges.form';

export type ChoisirCahierDesChargesPageProps = ChoisirCahierDesChargesFormProps;

export const ChoisirCahierDesChargesPage: React.FC<ChoisirCahierDesChargesPageProps> = ({
  identifiantProjet,
  cahierDesCharges,
  cahiersDesChargesDisponibles,
  aBénéficiéDuDélaiCDC2022,
}) => {
  return (
    <ColumnPageTemplate
      banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet} />}
      leftColumn={{
        children: (
          <ChoisirCahierDesChargesForm
            identifiantProjet={identifiantProjet}
            cahierDesCharges={cahierDesCharges}
            cahiersDesChargesDisponibles={cahiersDesChargesDisponibles}
            aBénéficiéDuDélaiCDC2022={aBénéficiéDuDélaiCDC2022}
          />
        ),
      }}
      rightColumn={{
        children: (
          <div>
            <Alert
              severity="info"
              small
              description={
                <div className="py-4 text-justify">
                  Pour plus d'informations sur les cahiers des charges modificatifs, veuillez
                  consulter cette&nbsp;
                  <Link
                    target="_blank"
                    href="https://docs.potentiel.beta.gouv.fr/guide-dutilisation/gestion-de-mon-projet-sur-potentiel/cahiers-des-charges-modificatifs"
                  >
                    page d'aide
                  </Link>
                  <br />
                  <span className="block mt-3">
                    Les cahiers des charges disponibles pour votre appel d'offres, sont consultables
                    sur&nbsp;
                    <Link target="_blank" href={cahierDesCharges.appelOffre.cahiersDesChargesUrl}>
                      cette page de la CRE
                    </Link>
                    .
                  </span>
                </div>
              }
            />
          </div>
        ),
      }}
    />
  );
};
