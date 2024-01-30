export class CreateOrderDto {
  items: OrderItemDtop[];
  card_hash: string;
}

export class OrderItemDtop {
  quantity: number;
  product_id: string;
}
