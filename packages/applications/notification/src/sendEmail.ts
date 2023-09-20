import { DomainEvent } from '@potentiel/core-domain';

export const sendEmail = (event: DomainEvent) => {
  console.log(`Email sent for ${event.type}`);
};
