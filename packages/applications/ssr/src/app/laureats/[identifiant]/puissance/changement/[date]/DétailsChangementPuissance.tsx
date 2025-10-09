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
import { Heading2, Heading4 } from '@/components/atoms/headings';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';
import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';

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

  return statut.estInformationEnregistrée() ? (
    <DétailsChangement
      domaineLabel="puissance"
      détailsSpécifiques={
        <DétailsPuissance
          unitéPuissance={unitéPuissance}
          puissanceInitiale={puissanceInitiale}
          nouvellePuissance={demande.nouvellePuissance}
          autoritéCompétente={demande.autoritéCompétente?.autoritéCompétente}
        />
      }
      changement={{
        enregistréPar: demande.demandéePar,
        enregistréLe: demande.demandéeLe,
        raison: demande.raison,
        pièceJustificative: demande.pièceJustificative,
      }}
    />
  ) : (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row gap-4">
          <Heading2>Demande de changement de puissance</Heading2>
          <StatutDemandeBadge statut={demande.statut.statut} />
        </div>
        <div className="text-xs italic">
          Demandé le{' '}
          <FormattedDate
            className="font-semibold"
            date={DateTime.bind(demande.demandéeLe).formatter()}
          />{' '}
          par <span className="font-semibold">{Email.bind(demande.demandéePar).formatter()}</span>
        </div>
      </div>
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
    </div>
  );
};

const DétailsPuissance = ({
  unitéPuissance,
  puissanceInitiale,
  nouvellePuissance,
  autoritéCompétente,
}: Pick<
  ChangementProps,
  'unitéPuissance' | 'puissanceInitiale' | 'nouvellePuissance' | 'autoritéCompétente'
>) => (
  <>
    <div>
      <span className="font-semibold">Puissance demandée</span> : {nouvellePuissance}{' '}
      {unitéPuissance}
    </div>
    <div>
      <span className="font-semibold">Puissance initiale</span> : {puissanceInitiale}{' '}
      {unitéPuissance}
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
  </>
);

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
  unitéPuissance,
  puissanceInitiale,
  autoritéCompétente,
}) => (
  <>
    <Heading4>Détails</Heading4>
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <DétailsPuissance
          unitéPuissance={unitéPuissance}
          puissanceInitiale={puissanceInitiale}
          nouvellePuissance={nouvellePuissance}
          autoritéCompétente={autoritéCompétente}
        />
      </div>
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

type ChangementAccordéProps = NonNullable<
  PlainType<Lauréat.Puissance.ConsulterChangementPuissanceReadModel['demande']['accord']>
>;

const ChangementAccordé: FC<ChangementAccordéProps> = ({
  accordéeLe,
  accordéePar,
  réponseSignée,
}) => (
  <>
    <div>
      <span className="font-semibold">Accordée le</span>
      : <FormattedDate className="font-semibold" date={DateTime.bind(accordéeLe).formatter()} />
    </div>
    <div>
      <span className="font-semibold">Accordée par</span>: {Email.bind(accordéePar).formatter()}
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
    <div>
      <span className="font-semibold">Rejetée le</span>
      : <FormattedDate className="font-semibold" date={DateTime.bind(rejetéeLe).formatter()} />
    </div>
    <div>
      <span className="font-semibold">Rejetée par</span>: {Email.bind(rejetéePar).formatter()}
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
