import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { PlainType } from '@potentiel-domain/core';
import { Abandon } from '@potentiel-domain/laureat';
import { DateTime, Email } from '@potentiel-domain/common';
import { Historique } from '@potentiel-domain/historique';

import { StatutAbandonBadge } from '@/components/pages/abandon/StatutAbandonBadge';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1, Heading2 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { HistoriqueTimeline } from '@/components/molecules/historique/HistoriqueTimeline';

import { StatutPreuveRecandidatureBadge } from './PreuveRecandidatureStatutBadge';
import { DemanderConfirmationAbandon } from './demanderConfirmation/DemanderConfirmationAbandon';
import { AccorderAbandonAvecRecandidature } from './accorder/AccorderAbandonAvecRecandidature';
import { AccorderAbandonSansRecandidature } from './accorder/AccorderAbandonSansRecandidature';
import { AnnulerAbandon } from './annuler/AnnulerAbandon';
import { ConfirmerAbandon } from './confirmer/ConfirmerAbandon';
import { RejeterAbandon } from './rejeter/RejeterAbandon';
import { InfoBoxMainlevéeSiAbandonAccordé } from './InfoBoxMainlevéeSiAbandonAccordé';
import {
  TransmettrePreuveRecandidature,
  TransmettrePreuveRecandidatureFormProps,
} from './transmettrePreuveRecandidature/TransmettrePreuveRecandidature';
import { PasserAbandonEnInstruction } from './passerEnInstruction/PasserAbandonEnInstruction';

type AvailableActions = Array<
  | 'demander-confirmation'
  | 'confirmer'
  | 'annuler'
  | 'accorder-avec-recandidature'
  | 'accorder-sans-recandidature'
  | 'rejeter'
  | 'transmettre-preuve-recandidature'
  | 'passer-en-instruction'
>;

type AvailableInformation = 'demande-de-mainlevée' | 'demande-abandon-pour-recandidature';

export type DétailsAbandonPageProps = {
  identifiantProjet: string;
  abandon: PlainType<Abandon.ConsulterAbandonReadModel>;
  projetsÀSélectionner: TransmettrePreuveRecandidatureFormProps['projetsÀSélectionner'];
  informations: Array<AvailableInformation>;
  historique: PlainType<Historique.ListerHistoriqueProjetReadModel>;
  actions: AvailableActions;
};

export const DétailsAbandonPage: FC<DétailsAbandonPageProps> = ({
  identifiantProjet,
  abandon,
  actions,
  informations,
  projetsÀSélectionner,
  historique,
}) => {
  const demandéLe = DateTime.bind(abandon.demande.demandéLe).formatter();
  const demandéPar = Email.bind(abandon.demande.demandéPar).formatter();

  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
      heading={<Heading1>Détail de l'abandon</Heading1>}
      leftColumn={{
        children: (
          <div className="flex flex-col gap-8">
            <div>
              <Heading2 className="mb-4">Contexte</Heading2>
              <div className="flex flex-col gap-2">
                <div className="text-xs italic gap-2">
                  Demandé le <FormattedDate className="font-semibold" date={demandéLe} /> par{' '}
                  <span className="font-semibold">{demandéPar}</span>
                </div>
                {abandon.demande.instruction && (
                  <div className="text-xs italic gap-2">
                    En instruction depuis le{' '}
                    <FormattedDate
                      className="font-semibold"
                      date={DateTime.bind(
                        abandon.demande.instruction.passéEnInstructionLe,
                      ).formatter()}
                    />{' '}
                    par{' '}
                    <span className="font-semibold">
                      {Email.bind(abandon.demande.instruction.passéEnInstructionPar).formatter()}
                    </span>
                  </div>
                )}
                <div>
                  Statut : <StatutAbandonBadge statut={abandon.statut.statut} />
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
                <div className="whitespace-nowrap">Explications :</div>
                <blockquote className="font-semibold italic">"{abandon.demande.raison}"</blockquote>
              </div>
            </div>
            <div className="mb-4">
              <Heading2>Historique</Heading2>
              <HistoriqueTimeline historique={historique} />
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
};

type MapToActionsComponentsProps = {
  actions: AvailableActions;
  identifiantProjet: string;
  projetsÀSélectionner: DétailsAbandonPageProps['projetsÀSélectionner'];
};

const mapToActionComponents = ({
  actions,
  identifiantProjet,
  projetsÀSélectionner,
}: MapToActionsComponentsProps) =>
  actions.length ? (
    <div className="flex flex-col gap-4">
      <Heading2>Actions</Heading2>

      {actions.includes('demander-confirmation') && (
        <DemanderConfirmationAbandon identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('accorder-avec-recandidature') && (
        <AccorderAbandonAvecRecandidature identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('accorder-sans-recandidature') && (
        <AccorderAbandonSansRecandidature identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('rejeter') && <RejeterAbandon identifiantProjet={identifiantProjet} />}
      {actions.includes('confirmer') && <ConfirmerAbandon identifiantProjet={identifiantProjet} />}
      {actions.includes('annuler') && <AnnulerAbandon identifiantProjet={identifiantProjet} />}
      {actions.includes('passer-en-instruction') && (
        <PasserAbandonEnInstruction identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('transmettre-preuve-recandidature') && (
        <TransmettrePreuveRecandidature
          identifiantProjet={identifiantProjet}
          projetsÀSélectionner={projetsÀSélectionner}
        />
      )}
    </div>
  ) : null;

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
