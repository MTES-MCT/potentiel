import { FC } from 'react';
import { match } from 'ts-pattern';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';

import { DateTime, Email } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { PlainType } from '@potentiel-domain/core';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading2, Heading5 } from '@/components/atoms/headings';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';

import { DétailsPuissancePageProps } from './DétailsPuissance.page';

export type DétailsChangementPuissanceProps = {
  demande: DétailsPuissancePageProps['demande'];
  unitéPuissance: DétailsPuissancePageProps['unitéPuissance'];
  puissanceInitiale: DétailsPuissancePageProps['puissanceInitiale'];
};

export const DétailsChangementPuissance: FC<DétailsChangementPuissanceProps> = ({
  demande,
  unitéPuissance,
  puissanceInitiale,
}) => {
  const statut = Lauréat.Puissance.StatutChangementPuissance.bind(demande.statut.statut);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <Heading2>
          {statut.estInformationEnregistrée()
            ? 'Changement de puissance'
            : 'Demande de changement de puissance'}
        </Heading2>
        <StatutDemandeBadge statut={demande.statut.statut} />
      </div>
      <>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {demande.accord && (
              <ChangementAccordé
                accordéeLe={demande.accord.accordéeLe}
                accordéePar={demande.accord.accordéePar}
                réponseSignée={demande.accord.réponseSignée}
              />
            )}
            {demande.rejet && (
              <ChangementRejeté
                rejetéeLe={demande.rejet.rejetéeLe}
                rejetéePar={demande.rejet.rejetéePar}
                réponseSignée={demande.rejet.réponseSignée}
              />
            )}
            {statut.estDemandé() && (
              <ChangementDemandé
                demandéeLe={demande.demandéeLe}
                demandéePar={demande.demandéePar}
              />
            )}
            {statut.estInformationEnregistrée() && (
              <InformationEnregistrée
                demandéeLe={demande.demandéeLe}
                demandéePar={demande.demandéePar}
              />
            )}
          </div>
        </div>
        <Changement
          nouvellePuissance={demande.nouvellePuissance}
          raison={demande.raison}
          pièceJustificative={demande.pièceJustificative}
          autoritéCompétente={demande.autoritéCompétente?.autoritéCompétente}
          unitéPuissance={unitéPuissance}
          puissanceInitiale={puissanceInitiale}
        />
      </>
    </div>
  );
};

type ChangementProps = {
  raison: DétailsChangementPuissanceProps['demande']['raison'];
  pièceJustificative: DétailsChangementPuissanceProps['demande']['pièceJustificative'];
  nouvellePuissance: DétailsChangementPuissanceProps['demande']['nouvellePuissance'];
  unitéPuissance: DétailsChangementPuissanceProps['unitéPuissance'];
  puissanceInitiale: DétailsChangementPuissanceProps['puissanceInitiale'];
  autoritéCompétente?: Lauréat.Puissance.AutoritéCompétente.RawType;
};

const Changement: FC<ChangementProps> = ({
  nouvellePuissance,
  pièceJustificative,
  raison,
  autoritéCompétente,
  unitéPuissance,
  puissanceInitiale,
}) => (
  <>
    <Heading5>Détails</Heading5>
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="font-semibold whitespace-nowrap">Puissance : </div>
        <div className="flex flex-col gap-2">
          <div>
            Puissance demandée : {nouvellePuissance} {unitéPuissance}
          </div>
          <div>
            Puissance initiale : {puissanceInitiale} {unitéPuissance}
          </div>
        </div>
      </div>
      {autoritéCompétente && (
        <div className="flex gap-2">
          <div className="font-semibold whitespace-nowrap">
            Autorité compétente pour l'instruction :
          </div>
          <div>
            {match(autoritéCompétente)
              .with('dreal', () => 'DREAL')
              .with('dgec-admin', () => 'DGEC')
              .exhaustive()}
          </div>
          {autoritéCompétente === 'dgec-admin' && (
            <Tooltip
              kind="hover"
              title={
                'Cette demande de changement de puissance à la hausse et en dehors de la fourchette prévue aux cahiers des charges est une demande dérogatoire qui n’est pas prévue par les cahiers des charges. Par conséquent, elle fait l’objet d’une instruction par la DGEC.'
              }
            />
          )}
        </div>
      )}
      {raison && (
        <div className="flex gap-2">
          <div className="font-semibold whitespace-nowrap">Raison du changement :</div>
          <div>{raison}</div>
        </div>
      )}
      {pièceJustificative && (
        <div className="flex gap-2">
          <div className="font-semibold whitespace-nowrap">Pièce(s) justificative(s) :</div>
          <DownloadDocument
            className="mb-0"
            label="Télécharger la pièce justificative"
            format={pièceJustificative.format}
            url={Routes.Document.télécharger(DocumentProjet.bind(pièceJustificative).formatter())}
          />
        </div>
      )}
    </div>
  </>
);

const InformationEnregistrée: FC<ChangementDemandéProps> = ({ demandéeLe, demandéePar }) => (
  <>
    <div className="text-xs italic">
      Modifié le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(demandéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(demandéePar).formatter()}</span>
    </div>
  </>
);

type ChangementDemandéProps = Pick<
  PlainType<Lauréat.Puissance.ConsulterChangementPuissanceReadModel['demande']>,
  'demandéeLe' | 'demandéePar'
>;

const ChangementDemandé: FC<ChangementDemandéProps> = ({ demandéeLe, demandéePar }) => (
  <>
    <div className="text-xs italic">
      Demandé le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(demandéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(demandéePar).formatter()}</span>
    </div>
  </>
);

type ChangementAccordéProps = NonNullable<
  PlainType<Lauréat.Puissance.ConsulterChangementPuissanceReadModel['demande']['accord']>
>;

const ChangementAccordé: FC<ChangementAccordéProps> = ({
  accordéeLe,
  accordéePar,
  réponseSignée,
}) => (
  <>
    <div className="text-xs italic">
      Accordée le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(accordéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(accordéePar).formatter()}</span>
    </div>
    {réponseSignée && (
      <div className="flex gap-2">
        <div className="font-semibold whitespace-nowrap">Réponse signée :</div>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la réponse signée"
          format={réponseSignée.format}
          url={Routes.Document.télécharger(DocumentProjet.bind(réponseSignée).formatter())}
        />
      </div>
    )}
  </>
);

type ChangementRejetéProps = NonNullable<
  PlainType<Lauréat.Puissance.ConsulterChangementPuissanceReadModel['demande']['rejet']>
>;

const ChangementRejeté: FC<ChangementRejetéProps> = ({ rejetéeLe, rejetéePar, réponseSignée }) => (
  <>
    <div className="text-xs italic">
      Rejetée le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(rejetéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(rejetéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Réponse signée :</div>
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format={réponseSignée.format}
        url={Routes.Document.télécharger(DocumentProjet.bind(réponseSignée).formatter())}
      />
    </div>
  </>
);
