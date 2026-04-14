import { FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import Accordion from '@codegouvfr/react-dsfr/Accordion';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';
import { PlainType } from '@potentiel-domain/core';
import { DocumentProjet, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { ActionMap, ActionsPageTemplate } from '@/components/templates/ActionsPage.template';
import { ConfirmationAction } from '@/components/molecules/ConfirmationAction';

import { GarantiesFinancières } from '../components/GarantiesFinancières';
import { getStatutMainlevéeLabel } from '../_helpers/statutMainlevéeLabels';

import {
  ActionMainlevée,
  ActionsMainlevéeProps,
  MainlevéeEnCours,
  MainlevéeEnCoursProps,
} from './MainlevéeEnCours';
import { HistoriqueMainlevéeRejetée } from './HistoriqueMainlevéeRejetée';
import { annulerDemandeMainlevéeGarantiesFinancièresAction } from './annuler/annulerDemandeMainlevée.action';
import { passerDemandeMainlevéeEnInstructionAction } from './passerEnInstruction/passerDemandeMainlevéeEnInstruction.action';
import { RejeterDemandeMainlevéeForm } from './rejeter/RejeterDemandeMainlevée.form';
import { AccorderDemandeMainlevée } from './accorder/AccorderDemandeMainlevée.form';

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
  const identifiantProjet = IdentifiantProjet.bind(mainlevée.identifiantProjet).formatter();

  const actionMap: ActionMap<ActionMainlevée> = {
    'garantiesFinancières.mainlevée.annuler': () => (
      <ConfirmationAction
        label="Annuler"
        action={annulerDemandeMainlevéeGarantiesFinancièresAction}
        confirmation={{
          title: 'Annuler la demande de mainlevée des garanties financières',
          description:
            'Êtes-vous sûr de vouloir annuler votre demande de mainlevée de vos garanties financières ?',
        }}
        formValues={{ identifiantProjet }}
        id="annuler-demande-mainlevée-gf"
      />
    ),
    'garantiesFinancières.mainlevée.démarrerInstruction': () => (
      <ConfirmationAction
        label="Démarrer l'instruction"
        action={passerDemandeMainlevéeEnInstructionAction}
        confirmation={{
          title: "Démarrer l'instruction de la demande de mainlevée des garanties financières",
          description: (
            <>
              <p>
                Êtes-vous sûr de vouloir démarrer l'instruction de votre demande de mainlevée de vos
                garanties financières ?
              </p>
              <span className="italic">
                Cela passera son statut en "{getStatutMainlevéeLabel('en-instruction')}" ?
              </span>
            </>
          ),
        }}
        formValues={{ identifiantProjet }}
        id="démarrer-instruction-demande-mainlevée-gf"
      />
    ),
    'garantiesFinancières.mainlevée.accorder': () => (
      <AccorderDemandeMainlevée identifiantProjet={identifiantProjet} />
    ),
    'garantiesFinancières.mainlevée.rejeter': () => (
      <RejeterDemandeMainlevéeForm identifiantProjet={identifiantProjet} />
    ),
  };

  return (
    <ActionsPageTemplate<ActionMainlevée>
      heading="Mainlevée des garanties financières"
      badge={<StatutDemandeBadge statut={mainlevée.statut.statut} />}
      actions={actions}
      actionMap={actionMap}
    >
      <div className="mb-4">
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
                      DocumentProjet.bind(achèvement.preuveTransmissionAuCocontractant).formatter(),
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
          <Accordion label="Cahier des charges">
            <Link href={urlAppelOffre} target="_blank">
              Voir le cahier des charges
            </Link>
          </Accordion>
          {mainlevéesRejetées.length > 0 && (
            <Accordion label="Mainlevées rejetées">
              <HistoriqueMainlevéeRejetée mainlevéesRejetées={mainlevéesRejetées} />
            </Accordion>
          )}
        </div>
      </div>

      <Button
        priority="secondary"
        iconId="fr-icon-arrow-left-line"
        linkProps={{
          href: Routes.GarantiesFinancières.détail(
            IdentifiantProjet.bind(mainlevée.identifiantProjet).formatter(),
          ),
        }}
      >
        Retour aux Garanties Financières
      </Button>
    </ActionsPageTemplate>
  );
};
