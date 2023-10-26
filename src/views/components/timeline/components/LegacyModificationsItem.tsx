import React from 'react';
import { ItemDate, ItemTitle, ContentArea, PastIcon, UnvalidatedStepIcon } from '.';
import { LegacyModificationsItemProps, makeDocumentUrl } from '../helpers';
import { CurrentIcon } from './CurrentIcon';
import { DownloadLink } from '../..';
import { afficherDate } from '../../../helpers';

export const LegacyModificationsItem = (props: LegacyModificationsItemProps) => {
  const { modificationType } = props;
  switch (modificationType) {
    case 'abandon':
      return <Abandon {...props} />;
    case 'recours':
      return <Recours {...props} />;
    case 'delai':
      return <Delai {...props} />;
    case 'producteur':
      return <Producteur {...props} />;
    case 'actionnaire':
      return <Actionnaire {...props} />;
    case 'autre':
      return <Autre {...props} />;
  }
};

const LegacyModificationContainer = (
  props: LegacyModificationsItemProps & { children: React.ReactNode },
) => {
  const { status, date, courrier, children } = props;
  return (
    <>
      <StepIcon status={status} />
      <ContentArea>
        <ItemDate date={date} />
        {children}
        {courrier && (
          <DownloadLink
            fileUrl={makeDocumentUrl(courrier.id, courrier.name)}
            aria-label={`Télécharger le courrier de la demande de type "${props.modificationType}"`}
          >
            Télécharger le courrier
          </DownloadLink>
        )}
      </ContentArea>
    </>
  );
};

type AbandonProps = LegacyModificationsItemProps & { modificationType: 'abandon' };

const Abandon = (props: AbandonProps) => {
  const { status } = props;
  const titleStatus =
    status === 'acceptée' ? 'accepté' : status === 'accord-de-principe' ? 'à accorder' : 'rejeté';
  return (
    <LegacyModificationContainer {...props}>
      <ItemTitle title={`Abandon ${titleStatus}`} />
    </LegacyModificationContainer>
  );
};

type RecoursProps = LegacyModificationsItemProps & { modificationType: 'recours' };

const Recours = (props: RecoursProps) => {
  const { status, motifElimination } = props;
  const titleStatus =
    status === 'acceptée' ? 'accepté' : status === 'accord-de-principe' ? 'à accorder' : 'rejeté';
  return (
    <LegacyModificationContainer {...props}>
      <ItemTitle title={`Recours ${titleStatus}`} />
      {motifElimination !== '' && <span>Motif de l'élimination : {motifElimination}</span>}
    </LegacyModificationContainer>
  );
};

type DelaiProps = LegacyModificationsItemProps & { modificationType: 'delai' };

const Delai = (props: DelaiProps) => {
  const { status } = props;
  const titleStatus =
    status === 'acceptée' ? 'accepté' : status === 'accord-de-principe' ? 'à accorder' : 'rejeté';
  return (
    <LegacyModificationContainer {...props}>
      <ItemTitle title={`Délai supplémentaire ${titleStatus}`} />
      {status === 'acceptée' && (
        <>
          <p className="p-0 m-0">
            Ancienne date limite d'attestation de conformité :{' '}
            {afficherDate(props.ancienneDateLimiteAchevement)}
          </p>
          <p className="p-0 m-0">
            Nouvelle date limite d'attestation de conformité :{' '}
            {afficherDate(props.nouvelleDateLimiteAchevement)}
          </p>
        </>
      )}
    </LegacyModificationContainer>
  );
};

type ProducteurProps = LegacyModificationsItemProps & { modificationType: 'producteur' };

const Producteur = (props: ProducteurProps) => {
  const { producteurPrecedent, status } = props;
  const titleStatus =
    status === 'acceptée' ? 'accepté' : status === 'accord-de-principe' ? 'à accorder' : 'rejeté';
  return (
    <LegacyModificationContainer {...props}>
      <ItemTitle title={`Changement de producteur ${titleStatus}`} />
      <p className="p-0 m-0">Producteur précédent : {producteurPrecedent}</p>
    </LegacyModificationContainer>
  );
};

type ActionnaireProps = LegacyModificationsItemProps & { modificationType: 'actionnaire' };

const Actionnaire = (props: ActionnaireProps) => {
  const { actionnairePrecedent, status } = props;
  const titleStatus = status === 'accord-de-principe' ? 'à accorder' : status;
  return (
    <LegacyModificationContainer {...props}>
      <ItemTitle title={`Modification de l'actionnariat ${titleStatus}`} />
      {actionnairePrecedent !== '' && (
        <p className="p-0 m-0">Actionnaire précédent : {actionnairePrecedent}</p>
      )}
    </LegacyModificationContainer>
  );
};

type AutreProps = LegacyModificationsItemProps & { modificationType: 'autre' };

const Autre = (props: AutreProps) => {
  const { column, value, status } = props;
  const titleStatus = status === 'accord-de-principe' ? 'à accorder' : status;
  return (
    <LegacyModificationContainer {...props}>
      <ItemTitle title={`Modification du projet ${titleStatus}`} />
      <p className="p-0 m-0">
        {column} : {value}
      </p>
    </LegacyModificationContainer>
  );
};

const StepIcon = (props: { status: LegacyModificationsItemProps['status'] }) => {
  const { status } = props;
  return (
    <>
      {status === 'acceptée' && <PastIcon />}
      {status === 'accord-de-principe' && <CurrentIcon />}
      {status === 'rejetée' && <UnvalidatedStepIcon />}
    </>
  );
};
