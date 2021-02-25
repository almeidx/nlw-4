import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSurveysUsers1614277167606 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        columns: [
          {
            isPrimary: true,
            name: 'id',
            type: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'survey_id',
            type: 'uuid',
          },
          {
            isNullable: true,
            name: 'value',
            type: 'number',
          },
          {
            default: 'now()',
            name: 'created_at',
            type: 'timestamp',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            name: 'FKUser',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
          },
          {
            columnNames: ['survey_id'],
            name: 'FKSurvey',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            referencedColumnNames: ['id'],
            referencedTableName: 'surveys',
          },
        ],
        name: 'surveys_users',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('surveys_users');
  }
}
