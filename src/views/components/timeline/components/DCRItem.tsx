import React, { useState } from 'react';
import { ItemTitle, ItemDate, ContentArea, PastIcon, CurrentIcon } from '.';
import ROUTES from '@routes';
import {
  Button,
  FormulaireChampsObligatoireLégende,
  Label,
  SecondaryButton,
  DownloadLink,
  Link,
  Dropdown,
  Input,
} from '@components';
import { WarningItem } from './WarningItem';
import { DCRItemProps } from '../helpers/extractDCRItemProps';
import { WarningIcon } from './WarningIcon';
import { format } from 'date-fns';

export const DCRItem = (props: DCRItemProps & { projectId: string }) => {
  const { status, projectId } = props;

  return status === 'submitted' ? (
    <Submitted {...{ ...props, projectId }} />
  ) : (
    <NotSubmitted {...{ ...props, projectId }} />
  );
};

type SubmittedProps = {
  role: string;
  date: number;
  url: string | undefined;
  projectId: string;
};

const Submitted = ({ role, date, url, projectId }: SubmittedProps) => {
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title="Demande complète de raccordement" />
        <div>
          {url ? (
            <DownloadLink fileUrl={url}>Télécharger l'accusé de réception</DownloadLink>
          ) : (
            <span>Pièce-jointe introuvable</span>
          )}
        </div>
        {role === 'porteur-projet' && <CancelDeposit {...{ projectId }} />}
      </ContentArea>
    </>
  );
};

type NotSubmittedProps = {
  role: string;
  date: number;
  projectId: string;
  status: 'due' | 'past-due';
};

const NotSubmitted = ({ role, date, projectId, status }: NotSubmittedProps) => {
  return (
    <>
      {status === 'past-due' && role === 'porteur-projet' ? <WarningIcon /> : <CurrentIcon />}
      <ContentArea>
        <div className="flex">
          <div className="align-middle">
            <ItemDate date={date} />
          </div>
          {status === 'past-due' && role === 'porteur-projet' && (
            <div className="align-middle mb-1">
              <WarningItem message="date dépassée" />
            </div>
          )}
        </div>
        <ItemTitle title="Demande complète de raccordement" />
        <div>
          {role === 'porteur-projet' ? (
            <>
              <p className="mt-0 mb-0">
                Après avoir effectué cette démarche auprès votre gestionnaire de réseau, vous pouvez
                nous transmettre l'accusé de réception.
              </p>
              <UploadForm projectId={projectId} />
            </>
          ) : (
            <p className="mt-0 mb-0">Accusé de réception de la demande en attente</p>
          )}
        </div>
      </ContentArea>
    </>
  );
};

type CancelDepositProps = { projectId: string };
const CancelDeposit = ({ projectId }: CancelDepositProps) => {
  return (
    <Link
      href={ROUTES.SUPPRIMER_ETAPE_ACTION({ projectId, type: 'dcr' })}
      onClick={(event) =>
        confirm(`Êtes-vous sur de vouloir annuler le dépôt et supprimer le document joint ?`) ||
        event.preventDefault()
      }
    >
      Annuler le dépôt
    </Link>
  );
};

type UploadFormProps = {
  projectId: string;
};

const UploadForm = ({ projectId }: UploadFormProps) => {
  const [displayForm, showForm] = useState(false);
  return (
    <Dropdown
      design="link"
      text="Transmettre l'accusé de réception"
      isOpen={displayForm}
      changeOpenState={(isOpen) => showForm(isOpen)}
    >
      <form
        action={ROUTES.DEPOSER_ETAPE_ACTION}
        method="post"
        encType="multipart/form-data"
        className="m-0 mt-2 border border-solid border-gray-300 rounded-md p-5 flex flex-col gap-3"
      >
        <FormulaireChampsObligatoireLégende className="text-right" />
        <input type="hidden" name="type" id="type" value="dcr" />
        <input type="hidden" name="projectId" value={projectId} />
        <div>
          <Label htmlFor="stepDate" required>
            Date de l'accusé de réception
          </Label>
          <Input
            type="date"
            id="stepDate"
            name="stepDate"
            max={format(new Date(), 'yyyy-MM-dd')}
            required
          />
        </div>
        <div className="mt-2">
          <Label htmlFor="file" required>
            Accusé de réception
          </Label>
          <Input type="file" name="file" id="file" required />
        </div>
        <div className="flex gap-4 flex-col md:flex-row mt-4">
          <Button type="submit">Envoyer</Button>
          <SecondaryButton onClick={() => showForm(false)}>Annuler</SecondaryButton>
        </div>
      </form>
    </Dropdown>
  );
};
