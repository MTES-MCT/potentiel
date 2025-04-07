import { FC } from 'react';

import { DateTime, Email } from '@potentiel-domain/common';
import { Puissance } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { PlainType } from '@potentiel-domain/core';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading2 } from '@/components/atoms/headings';

import { StatutChangementPuissanceBadge } from '../StatutChangementPuissanceBadge';

import { DétailsPuissancePageProps } from './DétailsPuissance.page';

export type DétailsChangementPuissanceProps = Pick<DétailsPuissancePageProps, 'demande'>;

export const DétailsChangementPuissance: FC<DétailsChangementPuissanceProps> = ({ demande }) => {
  const estUneInformationEnregistrée = Puissance.StatutChangementPuissance.bind(
    demande.statut.statut,
  ).estInformationEnregistrée();

  return (
    <div className="flex flex-col gap-4">
      <Heading2>
        {estUneInformationEnregistrée
          ? 'Changement de puissance'
          : 'Demande de changement de puissance'}
      </Heading2>
      <>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {!demande.isInformationEnregistrée && demande.accord && (
              <ChangementAccordé
                accordéeLe={demande.accord.accordéeLe}
                accordéePar={demande.accord.accordéePar}
                réponseSignée={demande.accord.réponseSignée}
              />
            )}
            {Puissance.StatutChangementPuissance.bind(demande.statut.statut).estDemandé() && (
              <ChangementDemandé
                demandéeLe={demande.demandéeLe}
                demandéePar={demande.demandéePar}
              />
            )}
            {estUneInformationEnregistrée && (
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
        />
      </>
    </div>
  );
};

type ChangementProps = Pick<
  PlainType<Puissance.ConsulterChangementPuissanceReadModel['demande']>,
  'raison' | 'pièceJustificative' | 'nouvellePuissance'
>;

const Changement: FC<ChangementProps> = ({ nouvellePuissance, pièceJustificative, raison }) => (
  <>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Puissance</div>
      <div>{nouvellePuissance}</div>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Raison du changement :</div>
      <div>{raison}</div>
    </div>
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
  </>
);

const InformationEnregistrée: FC<ChangementDemandéProps> = ({ demandéeLe, demandéePar }) => (
  <>
    <div className="text-xs italic">
      Modifié le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(demandéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(demandéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold">Statut :</div>{' '}
      <StatutChangementPuissanceBadge
        statut={Puissance.StatutChangementPuissance.informationEnregistrée.statut}
      />
    </div>
  </>
);

type ChangementDemandéProps = Pick<
  PlainType<Puissance.ConsulterChangementPuissanceReadModel['demande']>,
  'demandéeLe' | 'demandéePar'
>;

const ChangementDemandé: FC<ChangementDemandéProps> = ({ demandéeLe, demandéePar }) => (
  <>
    <div className="text-xs italic">
      Demandé le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(demandéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(demandéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold">Statut :</div>{' '}
      <StatutChangementPuissanceBadge statut={Puissance.StatutChangementPuissance.demandé.statut} />
    </div>
  </>
);

type ChangementAccordéProps = NonNullable<
  PlainType<Puissance.DétailsDemandeChangementPuissance['accord']>
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
    <div className="flex gap-2">
      <div className="font-semibold">Statut :</div>{' '}
      <StatutChangementPuissanceBadge statut={Puissance.StatutChangementPuissance.accordé.statut} />
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
