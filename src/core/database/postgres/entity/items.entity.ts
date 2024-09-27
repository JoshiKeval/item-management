import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base';
import { Users } from './users.entity';

@Entity('items')
export class Items extends Base {
  @PrimaryGeneratedColumn('uuid', { name: 'item_id' })
  itemId: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'description', nullable: true, type: 'varchar', length: 255 })
  description: string;

  @Column({ name: 'quantity', type: 'integer' })
  quantity: number;

  @Column({ name: 'image', type: 'text' })
  image: string;

  @ManyToOne(() => Users, (users) => users.items)
  @JoinColumn({ name: 'id' })
  users: Users;
  @Column({ name: 'user_id', type: 'varchar', length: 80 })
  userId: string;
}
