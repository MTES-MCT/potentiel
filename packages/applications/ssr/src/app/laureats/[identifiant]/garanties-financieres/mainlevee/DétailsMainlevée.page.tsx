import { FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import Accordion from '@codegouvfr/react-dsfr/Accordion';
import { fr } from '@codegouvfr/react-dsfr';

import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';
import { PlainType } from '@potentiel-domain/core';
import { DocumentProjet, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Heading2 } from '@/components/atoms/headings';

import { GarantiesFinancières } from '../components/GarantiesFinancières';

import {
  ActionsMainlevée,
  ActionsMainlevéeProps,
  MainlevéeEnCours,
  MainlevéeEnCoursProps,
} from './MainlevéeEnCours';
import { HistoriqueMainlevéeRejetée } from './HistoriqueMainlevéeRejetée';

export type DétailsMainlevéePageProps = MainlevéeEnCoursProps &
  ActionsMainlevéeProps & {
    garantiesFinancières: PlainType<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>;
    achèvement?: PlainType<Lauréat.Achèvement.ConsulterAchèvementReadModel>;
    abandon?: PlainType<Lauréat.Abandon.ConsulterAbandonReadModel>;
    mainlevéesRejetées: PlainType<Lauréat.GarantiesFinancières.ListerMainlevéeItemReadModel>[];
  };
export const DétailsMainlevéePage: FC<DétailsMainlevéePageProps> = ({
  mainlevée,
  garantiesFinancières,
  achèvement,
  abandon,
  actions,
  urlAppelOffre,
  mainlevéesRejetées,
}) => {
  return (
    <ColumnPageTemplate
      heading={
        <div className="flex flex-row gap-4">
          <div className="flex-shrink-0">
            <Heading2>Mainlevée des garanties financières</Heading2>
          </div>
          <div className="flex-shrink-0">
            <StatutDemandeBadge statut={mainlevée.statut.statut} />
          </div>
        </div>
      }
      leftColumn={{
        children: (
          <>
            {Option.isSome(mainlevée) && <MainlevéeEnCours mainlevée={mainlevée} />}

            <div className={clsx('mt-4', fr.cx('fr-accordions-group'))}>
              <Accordion label="Garanties financières actuelles">
                <GarantiesFinancières
                  garantiesFinancières={garantiesFinancières.garantiesFinancières}
                  document={garantiesFinancières.document}
                  soumisLe={garantiesFinancières.soumisLe}
                  validéLe={garantiesFinancières.validéLe}
                  peutModifier={false}
                />
              </Accordion>
              {achèvement?.estAchevé && (
                <Accordion label="Achèvement du projet">
                  <div className=" flex flex-col">
                    <div>
                      Date d'achèvement :{' '}
                      <FormattedDate
                        className="font-semibold"
                        date={achèvement.dateAchèvementRéel.date}
                      />
                    </div>
                    {Option.isSome(achèvement.attestation) && (
                      <DownloadDocument
                        format="pdf"
                        label="Télécharger l'attestation de conformité"
                        url={Routes.Document.télécharger(
                          DocumentProjet.bind(achèvement.attestation).formatter(),
                        )}
                      />
                    )}
                    {Option.isSome(achèvement.preuveTransmissionAuCocontractant) && (
                      <DownloadDocument
                        format="pdf"
                        label="Télécharger la preuve de transmission au cocontractant"
                        url={Routes.Document.télécharger(
                          DocumentProjet.bind(
                            achèvement.preuveTransmissionAuCocontractant,
                          ).formatter(),
                        )}
                      />
                    )}
                  </div>
                </Accordion>
              )}
              {abandon?.estAbandonné && (
                <Accordion label="Abandon du projet">
                  <div className=" flex flex-col">
                    <div>
                      Date d'abandon :{' '}
                      <FormattedDate className="font-semibold" date={abandon.accordéLe!.date} />
                    </div>
                    <div>
                      <Link
                        href={Routes.Abandon.détail(
                          IdentifiantProjet.bind(abandon.identifiantProjet).formatter(),
                          abandon.demandéLe.date,
                        )}
                      >
                        Voir la demande
                      </Link>
                    </div>
                  </div>
                </Accordion>
              )}
              {mainlevéesRejetées.length > 0 && (
                <Accordion label="Mainlevées rejetées">
                  <HistoriqueMainlevéeRejetée mainlevéesRejetées={mainlevéesRejetées} />
                </Accordion>
              )}
            </div>
          </>
        ),
      }}
      rightColumn={{
        children: (
          <ActionsMainlevée
            identifiantProjet={mainlevée.identifiantProjet}
            actions={actions}
            urlAppelOffre={urlAppelOffre}
          />
        ),
      }}
    />
  );
};
