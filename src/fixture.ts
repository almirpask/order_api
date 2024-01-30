import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const dataSource = app.get<DataSource>(getDataSourceToken());
  await dataSource.synchronize(true);

  const productRepo = dataSource.getRepository('Product');
  await productRepo.insert([
    {
      name: 'Product 1',
      description: 'Product 1 description',
      image_url: 'https://via.placeholder.com/150',
      price: 100,
    },
    {
      name: 'Product 2',
      description: 'Product 2 description',
      image_url: 'https://via.placeholder.com/150',
      price: 200,
    },
    {
      name: 'Product 3',
      description: 'Product 3 description',
      image_url: 'https://via.placeholder.com/150',
      price: 150,
    },
    {
      name: 'Product 4',
      description: 'Product 4 description',
      image_url: 'https://via.placeholder.com/150',
      price: 120,
    },
    {
      name: 'Product 5',
      description: 'Product 5 description',
      image_url: 'https://via.placeholder.com/150',
      price: 180,
    },
    {
      name: 'Product 6',
      description: 'Product 6 description',
      image_url: 'https://via.placeholder.com/150',
      price: 90,
    },
    {
      name: 'Product 7',
      description: 'Product 7 description',
      image_url: 'https://via.placeholder.com/150',
      price: 250,
    },
    {
      name: 'Product 8',
      description: 'Product 8 description',
      image_url: 'https://via.placeholder.com/150',
      price: 175,
    },
    {
      name: 'Product 9',
      description: 'Product 9 description',
      image_url: 'https://via.placeholder.com/150',
      price: 130,
    },
    {
      name: 'Product 10',
      description: 'Product 10 description',
      image_url: 'https://via.placeholder.com/150',
      price: 160,
    },
  ]);

  await app.close();
}
bootstrap();
