import { fr } from '@codegouvfr/react-dsfr';
import Accordion from '@codegouvfr/react-dsfr/Accordion';
import Button from '@codegouvfr/react-dsfr/Button';
import clsx from 'clsx';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { PlainType } from '@potentiel-domain/core';
import { DocumentProjet, IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Link } from '@/components/atoms/LinkNoPrefetch';
import { ConfirmationAction } from '@/components/molecules/ConfirmationAction';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';
import { type ActionMap, ActionsPageTemplate } from '@/components/templates/ActionsPage.template';
import { getStatutMainlevéeLabel } from '../_helpers/statutMainlevéeLabels';
import { GarantiesFinancières } from '../components/GarantiesFinancières';
import { AccorderDemandeMainlevée } from './accorder/AccorderDemandeMainlevée.form';
import { annulerDemandeMainlevéeGarantiesFinancièresAction } from './annuler/annulerDemandeMainlevée.action';
import { HistoriqueMainlevéeRejetée } from './HistoriqueMainlevéeRejetée';
import {
  type ActionMainlevée,
  type ActionsMainlevéeProps,
  MainlevéeEnCours,
  type MainlevéeEnCoursProps,
} from './MainlevéeEnCours';
import { passerDemandeMainlevéeEnInstructionAction } from './passerEnInstruction/passerDemandeMainlevéeEnInstruction.action';
import { RejeterDemandeMainlevéeForm } from './rejeter/RejeterDemandeMainlevée.form';

export type DétailsMainlevéePageProps = ActionsMainlevéeProps & {
  garantiesFinancières: PlainType<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresActuellesReadModel>;
  achèvement?: PlainType<Lauréat.Achèvement.ConsulterAchèvementReadModel>;
  abandon?: PlainType<Lauréat.Abandon.ConsulterAbandonReadModel>;
  mainlevéesRejetées: PlainType<Lauréat.GarantiesFinancières.ListerMainlevéeItemReadModel>[];
  mainlevée?: MainlevéeEnCoursProps['mainlevée'];
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
  const identifiantProjet = IdentifiantProjet.bind(
    garantiesFinancières.identifiantProjet,
  ).formatter();

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
                Êtes-vous sûr de vouloir démarrer l'instruction de la demande de mainlevée de vos
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
      /* Si mainlevée n'est pas définit c'est qu'il y a forcémenet 1 ou plusieurs mainlevées rejetées
         Sinon la page est notFound()
      */
      badge={<StatutDemandeBadge statut={mainlevée?.statut.statut ?? 'rejeté'} />}
      actions={actions}
      actionMap={actionMap}
    >
      <div className="mb-4">
        {mainlevée && <MainlevéeEnCours mainlevée={mainlevée} />}

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
          {abandon?.accordéLe && (
            <Accordion label="Abandon du projet">
              <div className=" flex flex-col">
                {abandon.accordéLe && (
                  <div>
                    Date d'abandon :{' '}
                    <FormattedDate className="font-semibold" date={abandon.accordéLe.date} />
                  </div>
                )}
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
          href: Routes.GarantiesFinancières.détail(identifiantProjet),
        }}
      >
        Retour aux Garanties Financières
      </Button>
    </ActionsPageTemplate>
  );
};
