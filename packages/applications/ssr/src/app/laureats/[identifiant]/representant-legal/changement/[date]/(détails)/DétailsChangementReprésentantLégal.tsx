import { FC } from 'react';
import { match } from 'ts-pattern';

import { PlainType } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { Heading2, Heading5 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';
import { DétailsInformationEnregistrée } from '@/components/organisms/demande/DétailsInformationEnregistrée';

import { InfoBoxDemandeEnCours } from './InfoBoxDemandeEnCours';

type DétailsChangementReprésentantLégalProps =
  PlainType<Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel> & {
    identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
    dateDemandeEnCoursPourLien?: string;
  };

export const DétailsChangementReprésentantLégal: FC<DétailsChangementReprésentantLégalProps> = ({
  identifiantProjet,
  demande: {
    statut,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    demandéLe,
    demandéPar,
    accord,
    rejet,
  },
  dateDemandeEnCoursPourLien,
}) => {
  const idProjet = IdentifiantProjet.bind(identifiantProjet).formatter();

  return statut.statut === 'information-enregistrée' ? (
    <DétailsInformationEnregistrée
      title="Changement de représentant légal"
      détailsSpécifiques={
        <ReprésentantLégal
          nomReprésentantLégal={nomReprésentantLégal}
          typeReprésentantLégal={typeReprésentantLégal}
        />
      }
      changement={{
        enregistréPar: demandéPar,
        enregistréLe: demandéLe,
        pièceJustificative,
      }}
    />
  ) : (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row gap-4">
          <Heading2>Changement de représentant légal</Heading2>
          <StatutDemandeBadge statut={statut.statut} />
        </div>
        <div className="text-xs italic">
          Demandé le{' '}
          <FormattedDate className="font-medium" date={DateTime.bind(demandéLe).formatter()} /> par{' '}
          <span className="font-medium">{Email.bind(demandéPar).formatter()}</span>
        </div>
      </div>
      {dateDemandeEnCoursPourLien && (
        <InfoBoxDemandeEnCours
          lien={Routes.ReprésentantLégal.changement.détails(idProjet, dateDemandeEnCoursPourLien)}
        />
      )}
      <div className="flex flex-col gap-4">
        <div>
          {accord ? (
            <ChangementAccordé
              accordéLe={accord.accordéLe}
              accordéPar={accord.accordéPar}
              nomReprésentantLégal={accord.nomReprésentantLégal}
              typeReprésentantLégal={accord.typeReprésentantLégal}
            />
          ) : rejet ? (
            <ChangementRejeté
              motif={rejet.motif}
              rejetéLe={rejet.rejetéLe}
              rejetéPar={rejet.rejetéPar}
              nomReprésentantLégal={nomReprésentantLégal}
              typeReprésentantLégal={typeReprésentantLégal}
            />
          ) : null}
        </div>
        <Changement
          nomReprésentantLégal={nomReprésentantLégal}
          pièceJustificative={pièceJustificative}
          typeReprésentantLégal={typeReprésentantLégal}
        />
      </div>
    </div>
  );
};

const getTypeLabel = (type: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType) =>
  match(type)
    .returnType<string>()
    .with('personne-physique', () => 'Personne physique')
    .with('personne-morale', () => 'Personne morale')
    .with('collectivité', () => 'Collectivité')
    .with('autre', () => 'Organisme')
    .with('inconnu', () => 'Inconnu')
    .exhaustive();

const ReprésentantLégal = ({
  typeReprésentantLégal,
  nomReprésentantLégal,
}: Pick<ChangementProps, 'typeReprésentantLégal' | 'nomReprésentantLégal'>) => (
  <div>
    <div>
      <span className="font-medium">Type :</span>{' '}
      {getTypeLabel(
        Lauréat.ReprésentantLégal.TypeReprésentantLégal.bind(typeReprésentantLégal).formatter(),
      )}
    </div>
    <div>
      <span className="font-medium">Nom représentant légal :</span> {nomReprésentantLégal}
    </div>
  </div>
);

type ChangementProps = Pick<
  PlainType<DétailsChangementReprésentantLégalProps['demande']>,
  'typeReprésentantLégal' | 'pièceJustificative' | 'nomReprésentantLégal'
>;

const Changement: FC<ChangementProps> = ({
  nomReprésentantLégal,
  pièceJustificative,
  typeReprésentantLégal,
}) => (
  <div>
    <Heading5>Détails de la demande</Heading5>
    <ReprésentantLégal
      nomReprésentantLégal={nomReprésentantLégal}
      typeReprésentantLégal={typeReprésentantLégal}
    />
    <div className="flex gap-2">
      <div className="font-medium whitespace-nowrap">Pièce justificative :</div>
      <DownloadDocument
        className="mb-0"
        label="Télécharger la pièce justificative"
        format={pièceJustificative.format}
        url={Routes.Document.télécharger(DocumentProjet.bind(pièceJustificative).formatter())}
      />
    </div>
  </div>
);

type ChangementAccordéProps = NonNullable<
  DétailsChangementReprésentantLégalProps['demande']['accord']
>;

const ChangementAccordé: FC<ChangementAccordéProps> = ({ accordéLe, accordéPar }) => (
  <div>
    <Heading5>Accord</Heading5>
    <div>
      Accordé le{' '}
      <FormattedDate className="font-medium" date={DateTime.bind(accordéLe).formatter()} />, par{' '}
      <span className="font-medium">{Email.bind(accordéPar).formatter()}</span>
    </div>
  </div>
);

type ChangementRejetéProps = NonNullable<
  DétailsChangementReprésentantLégalProps['demande']['rejet'] & {
    nomReprésentantLégal: DétailsChangementReprésentantLégalProps['demande']['nomReprésentantLégal'];
    typeReprésentantLégal: DétailsChangementReprésentantLégalProps['demande']['typeReprésentantLégal'];
  }
>;

const ChangementRejeté: FC<ChangementRejetéProps> = ({ rejetéLe, rejetéPar, motif }) => (
  <div>
    <Heading5>Rejet</Heading5>
    <div>
      Rejeté le <FormattedDate className="font-medium" date={DateTime.bind(rejetéLe).formatter()} />
      , par <span className="font-medium">{Email.bind(rejetéPar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-medium">Motif :</div>
      {motif}
    </div>
  </div>
);
