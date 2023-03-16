import { QueryInterface, QueryTypes } from 'sequelize';
import { v4 as uuid } from 'uuid';

type LegacyUserCreatedEvent = {
  id: string;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  getVersion: () => number;
  aggregateId: string[] | string | undefined;
  requestId?: string;
  payload: {
    userId: string;
    keycloakId: string;
    email: string;
    role: string;
    fullName: string;
    projectAdmissionKey?: string;
  };
};

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const events: Array<LegacyUserCreatedEvent> = await queryInterface.sequelize.query(
        `SELECT * from "eventStores" WHERE type = ?`,
        {
          type: QueryTypes.SELECT,
          replacements: ['LegacyUserCreated'],
          transaction,
        },
      );

      for (const event of events) {
        await queryInterface.sequelize.query(
          `INSERT INTO "eventStores" (
            "id",
            "type",
            "version",
            "payload",
            "occurredAt",
            "createdAt",
            "updatedAt",
            "aggregateId"
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          {
            type: QueryTypes.INSERT,
            replacements: [
              uuid(),
              'UserCreated',
              1,
              JSON.stringify({
                email: event.payload.email,
                userId: event.payload.userId,
                fullName: event.payload.fullName,
                role: event.payload.role,
                createdBy: 'DEV',
              }),
              event.occurredAt,
              event.createdAt,
              event.updatedAt,
              `{${event.aggregateId}}`,
            ],
            transaction,
          },
        );
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async () => {},
};
