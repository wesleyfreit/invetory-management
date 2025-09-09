import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Product, ProductSize } from '../../enterprise/entities/product';
import { ProductsRepository } from '../repositories/products-repository';

interface UpdateProductUseCaseRequest {
  productId: string;
  name?: string;
  size?: ProductSize;
  color?: string;
  price?: number;
}

type UpdateProductUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: Product;
  }
>;

export class UpdateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
    name,
    size,
    color,
    price,
  }: UpdateProductUseCaseRequest): Promise<UpdateProductUseCaseResponse> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    product.name = name ?? product.name;
    product.size = size ?? product.size;
    product.color = color ?? product.color;
    product.price = price ?? product.price;

    await this.productsRepository.save(product);

    return right({
      product,
    });
  }
}
