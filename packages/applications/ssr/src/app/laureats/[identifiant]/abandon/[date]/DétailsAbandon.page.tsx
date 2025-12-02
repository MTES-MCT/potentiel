import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { PlainType } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1, Heading2 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Timeline } from '@/components/organisms/timeline';
import { ActionsList } from '@/components/templates/ActionsList.template';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';
import { TimelineItemProps } from '@/components/organisms/timeline';
import { DisplayAuteur } from '@/components/atoms/demande/DisplayAuteur';

import {
  TransmettrePreuveRecandidature,
  TransmettrePreuveRecandidatureFormProps,
} from '../transmettre-preuve-recandidature/TransmettrePreuveRecandidature';
import { StatutPreuveRecandidatureBadge } from '../transmettre-preuve-recandidature/StatutPreuveRecandidatureBadge';

import { DemanderConfirmationAbandon } from './demanderConfirmation/DemanderConfirmationAbandon';
import { AccorderAbandonAvecRecandidature } from './accorder/AccorderAbandonAvecRecandidature';
import { AccorderAbandonSansRecandidature } from './accorder/AccorderAbandonSansRecandidature';
import { AnnulerAbandon } from './annuler/AnnulerAbandon';
import { ConfirmerAbandon } from './confirmer/ConfirmerAbandon';
import { RejeterAbandon } from './rejeter/RejeterAbandon';
import { PasserAbandonEnInstruction } from './passerEnInstruction/PasserAbandonEnInstruction.form';
import { InfoBoxMainlevéeSiAbandonAccordé } from './InfoBoxMainlevéeSiAbandonAccordé';

type AvailableActions = Array<
  | 'demander-confirmation'
  | 'confirmer'
  | 'annuler'
  | 'accorder-avec-recandidature'
  | 'accorder-sans-recandidature'
  | 'rejeter'
  | 'transmettre-preuve-recandidature'
  | 'passer-en-instruction'
  | 'reprendre-instruction'
>;

type AvailableInformation = 'demande-de-mainlevée' | 'demande-abandon-pour-recandidature';

export type DétailsAbandonPageProps = {
  identifiantProjet: string;
  abandon: PlainType<Lauréat.Abandon.ConsulterDemandeAbandonReadModel>;
  projetsÀSélectionner: TransmettrePreuveRecandidatureFormProps['projetsÀSélectionner'];
  informations: Array<AvailableInformation>;
  historique: Array<TimelineItemProps>;
  actions: AvailableActions;
};

export const DétailsAbandonPage: FC<DétailsAbandonPageProps> = ({
  identifiantProjet,
  abandon,
  actions,
  informations,
  projetsÀSélectionner,
  historique,
}) => (
  <ColumnPageTemplate
    heading={<Heading1>Demande d'abandon</Heading1>}
    leftColumn={{
      children: (
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <Heading2>Détails</Heading2>
            <StatutDemandeBadge statut={abandon.statut.statut} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xs italic gap-2 font-semibold">
              Demandé le{' '}
              <FormattedDate date={DateTime.bind(abandon.demande.demandéLe).formatter()} />
              <DisplayAuteur email={Email.bind(abandon.demande.demandéPar)} />
            </div>
            {abandon.demande.accord?.accordéLe && abandon.demande.recandidature && (
              <div>
                Abandon avec recandidature :{' '}
                <StatutPreuveRecandidatureBadge
                  statut={abandon.demande.recandidature.statut.statut}
                />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <div className="whitespace-nowrap font-semibold">
              Autorité compétente pour l'instruction :
            </div>
            {abandon.demande.autoritéCompétente.autoritéCompétente.toLocaleUpperCase()}
          </div>
          <div className="flex gap-2">
            <div className="whitespace-nowrap font-semibold">Raison :</div>
            <blockquote>"{abandon.demande.raison}"</blockquote>
          </div>
          <div className="mb-4">
            <Heading2>Historique</Heading2>
            <Timeline items={historique} />
          </div>
        </div>
      ),
    }}
    rightColumn={{
      className: 'flex flex-col gap-8',
      children: (
        <>
          {mapToActionComponents({
            actions,
            identifiantProjet,
            projetsÀSélectionner,
            dateDemande: abandon.demande.demandéLe.date,
          })}
          {mapToInformationsComponents({
            informations,
            identifiantProjet,
          })}
        </>
      ),
    }}
  />
);

type MapToActionsComponentsProps = {
  actions: AvailableActions;
  identifiantProjet: string;
  projetsÀSélectionner: DétailsAbandonPageProps['projetsÀSélectionner'];
  dateDemande: string;
};

const mapToActionComponents = ({
  actions,
  identifiantProjet,
  projetsÀSélectionner,
  dateDemande,
}: MapToActionsComponentsProps) => (
  <ActionsList actionsListLength={actions.length}>
    {(actions.includes('passer-en-instruction') || actions.includes('reprendre-instruction')) && (
      <PasserAbandonEnInstruction
        identifiantProjet={identifiantProjet}
        estUneReprise={actions.includes('reprendre-instruction')}
        dateDemande={dateDemande}
      />
    )}
    {actions.includes('demander-confirmation') && (
      <DemanderConfirmationAbandon identifiantProjet={identifiantProjet} />
    )}
    {actions.includes('accorder-avec-recandidature') && (
      <AccorderAbandonAvecRecandidature
        identifiantProjet={identifiantProjet}
        dateDemande={dateDemande}
      />
    )}
    {actions.includes('accorder-sans-recandidature') && (
      <AccorderAbandonSansRecandidature
        identifiantProjet={identifiantProjet}
        dateDemande={dateDemande}
      />
    )}
    {actions.includes('rejeter') && (
      <RejeterAbandon identifiantProjet={identifiantProjet} dateDemande={dateDemande} />
    )}
    {actions.includes('confirmer') && (
      <ConfirmerAbandon identifiantProjet={identifiantProjet} dateDemande={dateDemande} />
    )}
    {actions.includes('transmettre-preuve-recandidature') && (
      <TransmettrePreuveRecandidature
        identifiantProjet={identifiantProjet}
        projetsÀSélectionner={projetsÀSélectionner}
        dateDemande={dateDemande}
      />
    )}
    {actions.includes('annuler') && <AnnulerAbandon identifiantProjet={identifiantProjet} />}
  </ActionsList>
);

type MapToInformationsComponentsProps = {
  informations: Array<AvailableInformation>;
  identifiantProjet: string;
};

const mapToInformationsComponents = ({
  informations,
  identifiantProjet,
}: MapToInformationsComponentsProps) =>
  informations.length ? (
    <div className="flex flex-col gap-4">
      <Heading2>Informations</Heading2>
      {informations.includes('demande-abandon-pour-recandidature') && (
        <Alert
          severity="warning"
          small
          description={
            <div>
              <div className="font-semibold mb-2">Demande d'abandon pour recandidature</div>
              Le porteur s'engage sur l'honneur à ne pas avoir débuté ses travaux au sens du cahier
              des charges de l'AO associé et à abandonner son statut de lauréat au profit d'une
              recandidature réalisée au plus tard le 31/12/2024. <br />
              Il s'engage sur l'honneur à ce que cette recandidature respecte les conditions
              suivantes :
              <ul className="mb-0 list-disc indent-8 list-inside">
                <li>
                  Que le dossier soit complet et respecte les conditions d'éligibilité du cahier des
                  charges concerné
                </li>
                <li>Le même lieu d'implantation que le projet abandonné</li>
                <li>
                  La même autorisation préfectorale (numéro ICPE identifique) que le projet
                  abandonné, nonobstant des "porter à connaissance" ultérieurs
                </li>
                <li>
                  Le tarif proposé ne doit pas être supérieur au prix plafond de la période dont le
                  projet était initialement lauréat, indexé jusqu’à septembre 2023 selon la formule
                  d’indexation du prix de référence indiquée dans le cahier des charges concerné par
                  la recandidature.
                </li>
              </ul>
            </div>
          }
        />
      )}
      {informations.includes('demande-de-mainlevée') && (
        <InfoBoxMainlevéeSiAbandonAccordé identifiantProjet={identifiantProjet} />
      )}
    </div>
  ) : null;
