import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int' })
  order_id: number;
  @Column({})
  quantity: number;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({})
  product_id: string;

  @ManyToOne(() => Product, (order) => order.id)
  order: Order;

  @CreateDateColumn()
  created_at: Date;
}
