import React from 'react';
import { ContentArea, ItemDate, ItemTitle, PastIcon } from '.';
import routes from '../../../../routes';
import { makeDocumentUrl } from '../helpers';
import { AttachedFileItemProps } from '../helpers/extractAttachedFileItemProps';
import { DownloadLink, Form, SecondaryButton, TrashIcon } from "../..";

export const AttachedFileItem = (props: AttachedFileItemProps) => {
  const { date, title, description, files, isOwner, attachmentId, projectId, attachedBy } = props;
  return (
    <>
      <PastIcon />
      <ContentArea>
        <div className="align-middle">
          <ItemDate date={date} />
        </div>
        <ItemTitle title={title} />
        {description && <span>{description}</span>}
        <ul className="list-none pl-0 mt-1">
          {files.map(({ id, name }) => (
            <li key={`fichier_${id}`}>
              <DownloadLink fileUrl={makeDocumentUrl(id, name)}>{name}</DownloadLink>
            </li>
          ))}
        </ul>
        {!!attachedBy.name ? (
          <div className="text-sm mt-1">
            Attaché par {attachedBy.name}{' '}
            {!!attachedBy.administration && `(${attachedBy.administration})`}
          </div>
        ) : null}
        {isOwner && (
          <Form
            className="p-0 ml-0 mt-2"
            method="post"
            action={routes.RETIRER_FICHIER_DU_PROJET_ACTION}
          >
            <input type="hidden" name="attachmentId" value={attachmentId} />
            <input type="hidden" name="projectId" value={projectId} />
            <SecondaryButton
              className="border-error-425-base text-error-425-base hover:bg-error-950-base focus:bg-error-950-base"
              confirmation="Etes-vous sur de vouloir retirer ce(s) fichier(s) ?"
            >
              <TrashIcon className="h-4 w-4 mr-2 align-middle text-error-425-base" />
              Retirer
            </SecondaryButton>
          </Form>
        )}
      </ContentArea>
    </>
  );
};
