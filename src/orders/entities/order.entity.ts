import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;
  @Column({})
  client_id: number;
  @Column({})
  status: OrderStatus = OrderStatus.PENDING;
  @CreateDateColumn()
  created_at: Date;
}
