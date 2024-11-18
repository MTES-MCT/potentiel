import Badge from '@codegouvfr/react-dsfr/Badge';
import React from 'react';

type NotificationBadgeProps = {
  estNotifié: boolean;
};

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ estNotifié }) => {
  return (
    <Badge small noIcon severity={estNotifié ? 'info' : 'new'}>
      {estNotifié ? 'notifié' : 'à notifier'}
    </Badge>
  );
};
