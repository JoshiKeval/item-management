import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';
import { Items } from './items.entity';

@Entity('users')
export class Users extends Base {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 100 })
  password: string;

  @Column({ name: 'email_verification_token', type: 'varchar', length: 150 })
  emailVerificationToken: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 10,
    default: 'Inactive',
  })
  status: string;

  @Column({ name: 'is_email_verified', type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  @OneToMany(() => Items, (items) => items.users)
  items: Items[];
}
