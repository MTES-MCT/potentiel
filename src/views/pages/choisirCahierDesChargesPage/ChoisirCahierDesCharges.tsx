import React from 'react';
import {
  ChoisirCahierDesChargesFormulaire,
  Heading1,
  InfoBox,
  InfoLienGuideUtilisationCDC,
  LegacyPageTemplate,
} from '@components';
import { ProjectDataForChoisirCDCPage } from '@modules/project';
import { Request } from 'express';
import { hydrateOnClient } from '../../helpers';

type ChoisirCahierDesChargesProps = {
  request: Request;
  projet: ProjectDataForChoisirCDCPage;
};

export const ChoisirCahierDesCharges = ({ projet, request }: ChoisirCahierDesChargesProps) => {
  return (
    <LegacyPageTemplate user={request.user} currentPage="list-projects">
      <Heading1>Cahier des charges</Heading1>
      <div className="flex flex-col max-w-2xl mx-auto">
        <InfoBox className="mb-5">
          <InfoLienGuideUtilisationCDC />
        </InfoBox>
        <ChoisirCahierDesChargesFormulaire projet={projet} />
      </div>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(ChoisirCahierDesCharges);
