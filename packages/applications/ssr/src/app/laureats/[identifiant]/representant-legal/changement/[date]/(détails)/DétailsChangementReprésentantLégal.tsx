import { FC } from 'react';
import { match } from 'ts-pattern';

import { PlainType } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { Heading2 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemande';

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
  const estUneInformationEnregistrée =
    Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.bind(
      statut,
    ).estInformationEnregistrée();

  const idProjet = IdentifiantProjet.bind(identifiantProjet).formatter();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <Heading2>
          {estUneInformationEnregistrée
            ? 'Changement de représentant légal'
            : 'Demande de changement de représentant légal'}
        </Heading2>
        <StatutDemandeBadge statut={statut.statut} />
      </div>
      <div className="flex flex-col">
        {dateDemandeEnCoursPourLien && (
          <InfoBoxDemandeEnCours
            lien={Routes.ReprésentantLégal.changement.détails(idProjet, dateDemandeEnCoursPourLien)}
          />
        )}
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
        ) : estUneInformationEnregistrée ? (
          <InformationEnregistrée
            demandéLe={demandéLe}
            demandéPar={demandéPar}
            nomReprésentantLégal={nomReprésentantLégal}
            typeReprésentantLégal={typeReprésentantLégal}
            pièceJustificative={pièceJustificative}
          />
        ) : Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.bind(
            statut,
          ).estDemandé() ? (
          <ChangementDemandé
            demandéLe={demandéLe}
            demandéPar={demandéPar}
            nomReprésentantLégal={nomReprésentantLégal}
            typeReprésentantLégal={typeReprésentantLégal}
            pièceJustificative={pièceJustificative}
          />
        ) : null}
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
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Type :</div>
      <div>
        {getTypeLabel(
          Lauréat.ReprésentantLégal.TypeReprésentantLégal.bind(typeReprésentantLégal).formatter(),
        )}
      </div>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Nom représentant légal :</div>
      <div>{nomReprésentantLégal}</div>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Pièce justificative :</div>
      <DownloadDocument
        className="mb-0"
        label="Télécharger la pièce justificative"
        format={pièceJustificative.format}
        url={Routes.Document.télécharger(DocumentProjet.bind(pièceJustificative).formatter())}
      />
    </div>
  </div>
);

type ChangementDemandéProps = Omit<
  Omit<DétailsChangementReprésentantLégalProps['demande'], 'accord'>,
  'statut'
>;
const ChangementDemandé: FC<ChangementDemandéProps> = ({ demandéLe, demandéPar }) => (
  <div className="flex flex-col gap-2">
    <div className="text-xs italic">
      Demandé le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(demandéLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(demandéPar).formatter()}</span>
    </div>
  </div>
);

const InformationEnregistrée: FC<ChangementDemandéProps> = ({ demandéLe, demandéPar }) => (
  <div className="flex flex-col gap-2">
    <div className="text-xs italic">
      Modifié le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(demandéLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(demandéPar).formatter()}</span>
    </div>
  </div>
);

type ChangementAccordéProps = NonNullable<
  DétailsChangementReprésentantLégalProps['demande']['accord']
>;

const ChangementAccordé: FC<ChangementAccordéProps> = ({ accordéLe, accordéPar }) => (
  <div className="flex flex-col gap-2">
    <div className="text-xs italic">
      Accordé le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(accordéLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(accordéPar).formatter()}</span>
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
  <div className="flex flex-col gap-2">
    <div className="text-xs italic">
      Rejeté le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(rejetéLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(rejetéPar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold">Motif :</div>
      {motif}
    </div>
  </div>
);
