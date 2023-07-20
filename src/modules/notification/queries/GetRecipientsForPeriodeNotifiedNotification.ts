import { RecipientsForPeriodeNotifiedNotification } from '../dtos';

export type GetRecipientsForPeriodeNotifiedNotification = () =>
  | Promise<RecipientsForPeriodeNotifiedNotification>
  | undefined;
