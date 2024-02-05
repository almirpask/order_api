import {
  AmqpConnection,
  Nack,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductConsumer {
  constructor(
    private productService: ProductsService,
    private amqpConnection: AmqpConnection,
  ) {}

  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'ProductCreated',
    queue: 'products',
  })
  async consume(msg: CreateProductDto) {
    try {
      if (msg.id) {
        await this.productService.create(msg);
      }

      throw new InvalidStatusError('Invalid product format');
    } catch (error) {
      if (
        error instanceof EntityNotFoundError ||
        error instanceof InvalidStatusError
      ) {
        await this.amqpConnection.publish('amq.direct', 'ProductFailed', {
          error: error.message,
          id: msg.id,
        });

        return new Nack(false);
      }

      return new Nack(true);
    }
  }
}

class InvalidStatusError extends Error {
  constructor(invalidStatus: string) {
    super(`invalid status: ${invalidStatus}`);
  }
}
