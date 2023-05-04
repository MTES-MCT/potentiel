import type { Request } from 'express';
import React from 'react';
import ROUTES from '@routes';
import {
  SecondaryButton,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  Heading1,
  Label,
  Input,
} from '@components';
import { hydrateOnClient } from '../helpers';

type ImporterListingEnedisProps = {
  request: Request;
};

export const ImporterListingEnedis = ({ request }: ImporterListingEnedisProps) => {
  const {
    query: { error, success },
  } = request;

  return (
    <LegacyPageTemplate user={request.user}>
      <div className="panel">
        <div className="panel__header">
          <Heading1>Importer des données Enedis</Heading1>
        </div>

        <form action={ROUTES.IMPORTER_LISTING_ENEDIS} method="post" encType="multipart/form-data">
          {success && <SuccessBox title={success as string} />}
          {error && <ErrorBox title={error as string} />}
          <Label htmlFor="file">Sélectionner le fichier à importer.</Label>
          <Input type="file" name="file" id="file" />
          <SecondaryButton className="mt-2" type="submit" name="submit" id="submit">
            Envoyer
          </SecondaryButton>
        </form>
      </div>
    </LegacyPageTemplate>
  );
};
hydrateOnClient(ImporterListingEnedis);
