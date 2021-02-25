import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { Survey } from './Survey';
import { User } from './User';

@Entity('surveys_users')
export class SurveyUser {
  @PrimaryColumn()
  public readonly id: string;

  @Column()
  public user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @Column()
  public survey_id: string;

  @ManyToOne(() => Survey)
  @JoinColumn({ name: 'survey_id' })
  public survey: Survey;

  @Column()
  public value: number;

  @CreateDateColumn()
  public created_at: Date;

  public constructor() {
    if (!this.id) this.id = uuid();
  }
}
