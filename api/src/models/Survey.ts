import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('surveys')
export class Survey {
  @PrimaryColumn()
  public readonly id: string;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @CreateDateColumn()
  public created_at: Date;

  public constructor() {
    if (!this.id) this.id = uuid();
  }
}
