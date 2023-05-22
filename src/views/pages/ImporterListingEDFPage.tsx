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

type ImporterListingEDFProps = {
  request: Request;
};

export const ImporterListingEDF = ({ request }: ImporterListingEDFProps) => {
  const {
    query: { error, success },
  } = request;

  return (
    <LegacyPageTemplate user={request.user}>
      <Heading1>Importer des données producteurs</Heading1>

      <Form action={ROUTES.IMPORTER_LISTING_EDF} method="post" encType="multipart/form-data">
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

hydrateOnClient(ImporterListingEDF);
