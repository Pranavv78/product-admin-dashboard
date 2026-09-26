import Link from "next/link";

type ProductCardProps = {
  product: {
    id: number;
    title: string;
    category: string;
    price: number;
    rating: number;
    stock: number;
    images: string[];
  };
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="rounded-lg border p-4 shadow-sm">
        <img
     src={product.images?.[0] || "https://dummyjson.com/image/100x100"}
          alt={product.title}
          className="h-48 w-full rounded-lg bg-gray-100 object-contain p-4"
        />

        <h2 className="mt-4 text-xl font-bold">
          {product.title}
        </h2>

        <p className="mt-1 text-gray-500">
          {product.category}
        </p>

        <p className="mt-2 font-semibold">
          ${product.price}
        </p>

        <p>⭐ {product.rating}</p>

        <p>Stock: {product.stock}</p>
      </div>
    </Link>
  );
}