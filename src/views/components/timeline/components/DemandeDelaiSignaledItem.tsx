import React from 'react';
import { ItemDate, ItemTitle, ContentArea, PastIcon, UnvalidatedStepIcon, CurrentIcon } from '.';
import { makeDocumentUrl } from '../helpers';
import { DownloadLink } from '@components';
import { afficherDate } from '@views/helpers';

type DemandeDelaiSignaledItemProps = {
  date: number;
  attachment?: { id: string; name: string };
  notes?: string;
} & (
  | {
      status: 'acceptée';
      oldCompletionDueOn?: number;
      newCompletionDueOn: number;
    }
  | {
      status: 'rejetée';
    }
  | {
      status: 'accord-de-principe';
    }
);

export const DemandeDelaiSignaledItem = (props: DemandeDelaiSignaledItemProps) => {
  switch (props.status) {
    case 'acceptée':
      return <Accepted {...props} />;

    case 'rejetée':
      return <Rejected {...props} />;

    case 'accord-de-principe':
      return <AccordPrincipe {...props} />;
  }
};

type RejectedProps = Extract<DemandeDelaiSignaledItemProps, { status: 'rejetée' }>;

const Rejected = ({ date, attachment, notes }: RejectedProps) => (
  <>
    <UnvalidatedStepIcon />
    <ContentArea>
      <ItemDate date={date} />
      <>
        <ItemTitle title="Délai supplémentaire rejeté" />
        {notes && <p className="p-0 m-0 italic">Note : {notes}</p>}
      </>
      {attachment && (
        <DownloadLink
          fileUrl={makeDocumentUrl(attachment.id, attachment.name)}
          aria-label={`Télécharger le courrier de réponse de la demande de délai rejetée`}
        >
          Voir le courrier de réponse
        </DownloadLink>
      )}
    </ContentArea>
  </>
);

type AccordPrincipeProps = Extract<DemandeDelaiSignaledItemProps, { status: 'accord-de-principe' }>;

const AccordPrincipe = ({ date, attachment, notes }: AccordPrincipeProps) => (
  <>
    <CurrentIcon />
    <ContentArea>
      <ItemDate date={date} />
      <>
        <ItemTitle title="Délai supplémentaire à accorder" />
        {notes && <p className="p-0 m-0 italic">Note : {notes}</p>}
      </>
      {attachment && (
        <DownloadLink
          fileUrl={makeDocumentUrl(attachment.id, attachment.name)}
          aria-label={`Télécharger le courrier de réponse de la demande de délai en "accord de principe"`}
        >
          Voir le courrier de réponse
        </DownloadLink>
      )}
    </ContentArea>
  </>
);

type AcceptedProps = Extract<DemandeDelaiSignaledItemProps, { status: 'acceptée' }>;

const Accepted = ({
  date,
  newCompletionDueOn,
  oldCompletionDueOn,
  attachment,
  notes,
}: AcceptedProps) => (
  <>
    <PastIcon />
    <ContentArea>
      <ItemDate date={date} />
      <>
        <ItemTitle title="Délai supplémentaire accepté" />
        {oldCompletionDueOn && (
          <p className="p-0 m-0">
            Ancienne date limite d'attestation de conformité : {afficherDate(oldCompletionDueOn)}
          </p>
        )}
        <p className="p-0 m-0">
          Nouvelle date limite d'attestation de conformité : {afficherDate(newCompletionDueOn)}
        </p>
        {notes && <p className="p-0 m-0 italic">Note : {notes}</p>}
      </>
      {attachment && (
        <DownloadLink
          fileUrl={makeDocumentUrl(attachment.id, attachment.name)}
          aria-label={`Télécharger le courrier de réponse de la demande de délai accordée`}
        >
          Voir le courrier de réponse
        </DownloadLink>
      )}
    </ContentArea>
  </>
);
