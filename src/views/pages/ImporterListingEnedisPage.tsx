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
  Form,
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
      <Heading1>Importer des données Enedis</Heading1>

      <Form action={ROUTES.IMPORTER_LISTING_ENEDIS} method="post" encType="multipart/form-data">
        <div>
          {success && <SuccessBox title={success as string} />}
          {error && <ErrorBox title={error as string} />}
        </div>
        <div>
          <Label htmlFor="file">Sélectionner le fichier à importer.</Label>
          <Input type="file" name="file" id="file" />
        </div>
        <SecondaryButton type="submit" name="submit" id="submit">
          Envoyer
        </SecondaryButton>
      </Form>
    </LegacyPageTemplate>
  );
};
hydrateOnClient(ImporterListingEnedis);
