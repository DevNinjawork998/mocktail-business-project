"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/app/actions/products";
import * as S from "./ProductsListClient.styles";

interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: string;
  imageUrl: string | null;
  updatedAt: Date;
}

interface ProductsListClientProps {
  products: Product[];
}

export default function ProductsListClient({
  products,
}: ProductsListClientProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    const result = await deleteProduct(id);

    if (!result.success) {
      alert(result.error);
    }

    setDeletingId(null);
    router.refresh();
  };

  return (
    <S.Container>
      <S.Header>
        <S.HeaderContent>
          <S.Title>Products</S.Title>
          <S.Subtitle>{products.length} products total</S.Subtitle>
        </S.HeaderContent>
        <Link href="/dashboard/products/new">
          <S.AddButton>+ Add Product</S.AddButton>
        </Link>
      </S.Header>

      {products.length === 0 ? (
        <S.EmptyState>
          <S.EmptyIcon>🍹</S.EmptyIcon>
          <S.EmptyTitle>No products yet</S.EmptyTitle>
          <S.EmptyText>Create your first product to get started.</S.EmptyText>
          <Link href="/dashboard/products/new">
            <S.AddButton>+ Add Product</S.AddButton>
          </Link>
        </S.EmptyState>
      ) : (
        <S.Table>
          <S.TableHeader>
            <S.TableRow>
              <S.TableHead>Product</S.TableHead>
              <S.TableHead>Price</S.TableHead>
              <S.TableHead>Updated</S.TableHead>
              <S.TableHead>Actions</S.TableHead>
            </S.TableRow>
          </S.TableHeader>
          <S.TableBody>
            {products.map((product) => (
              <S.TableRow key={product.id}>
                <S.TableCell>
                  <S.ProductInfo>
                    {product.imageUrl ? (
                      <S.ProductImage>
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="48px"
                          style={{ objectFit: "cover" }}
                        />
                      </S.ProductImage>
                    ) : (
                      <S.ProductImagePlaceholder>🍹</S.ProductImagePlaceholder>
                    )}
                    <S.ProductDetails>
                      <S.ProductName>{product.name}</S.ProductName>
                      <S.ProductSubtitle>{product.subtitle}</S.ProductSubtitle>
                      <S.ProductDescription>{product.description}</S.ProductDescription>
                    </S.ProductDetails>
                  </S.ProductInfo>
                </S.TableCell>
                <S.TableCell>{product.price}</S.TableCell>
                <S.TableCell>
                  {new Date(product.updatedAt).toLocaleDateString()}
                </S.TableCell>
                <S.TableCell>
                  <S.Actions>
                    <Link href={`/dashboard/products/${product.id}`}>
                      <S.EditButton>Edit</S.EditButton>
                    </Link>
                    <S.DeleteButton
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deletingId === product.id}
                    >
                      {deletingId === product.id ? "..." : "Delete"}
                    </S.DeleteButton>
                  </S.Actions>
                </S.TableCell>
              </S.TableRow>
            ))}
          </S.TableBody>
        </S.Table>
      )}
    </S.Container>
  );
}
