import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { In, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private amqpConnection: AmqpConnection,
  ) {}
  async create(createOrderDto: CreateOrderDto & { client_id: number }) {
    const productIds = createOrderDto.items.map((item) => item.product_id);
    const uniqIds = [...new Set(productIds)];
    const products = await this.productRepo.findBy({
      id: In(uniqIds),
    });
    const foundIds = products.map((product) => product.id);

    if (products.length !== uniqIds.length) {
      throw new Error(
        `Product not found: ${uniqIds.filter((id) => !foundIds.includes(id))}`,
      );
    }
    const order = Order.create({
      client_id: createOrderDto.client_id,
      items: createOrderDto.items.map((item) => {
        const product = products.find(
          (product) => product.id === item.product_id,
        );
        return {
          price: product.price,
          product_id: item.product_id,
          quantity: item.quantity,
        };
      }),
    });

    await this.orderRepo.save(order);

    await this.amqpConnection.publish('amq.direct', 'OrderCreated', {
      order_id: order.id,
      card_hash: createOrderDto.card_hash,
      total: order.total,
    });
    console.log('order created');
    return order;
  }

  findAll(client_id: number) {
    return this.orderRepo.find({
      where: { client_id },
      order: { created_at: 'DESC' },
    });
  }

  findOne(id: string, client_id: number) {
    return this.orderRepo.findOneByOrFail({
      client_id,
      id,
    });
  }

  async pay(id: string) {
    const order = await this.orderRepo.findOneByOrFail({
      id,
    });
    order.pay();
    await this.orderRepo.save(order);

    return order;
  }

  async fail(id: string) {
    const order = await this.orderRepo.findOneByOrFail({
      id,
    });
    order.fail();
    await this.orderRepo.save(order);

    return order;
  }
}
