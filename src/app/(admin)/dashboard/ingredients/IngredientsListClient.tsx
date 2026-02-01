"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { deleteIngredient } from "@/app/actions/ingredients";
import * as S from "../products/ProductsListClient.styles";

interface Ingredient {
  id: string;
  name: string;
  icon: string;
  type: string;
  imageUrl: string | null;
  updatedAt: Date;
}

interface IngredientsListClientProps {
  ingredients: Ingredient[];
}

export default function IngredientsListClient({
  ingredients,
}: IngredientsListClientProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    const result = await deleteIngredient(id);

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
          <S.Title>Ingredients</S.Title>
          <S.Subtitle>{ingredients.length} ingredients total</S.Subtitle>
        </S.HeaderContent>
        <Link href="/dashboard/ingredients/new">
          <S.AddButton>+ Add Ingredient</S.AddButton>
        </Link>
      </S.Header>

      {ingredients.length === 0 ? (
        <S.EmptyState>
          <S.EmptyIcon>🌿</S.EmptyIcon>
          <S.EmptyTitle>No ingredients yet</S.EmptyTitle>
          <S.EmptyText>
            Create your first ingredient to get started.
          </S.EmptyText>
          <Link href="/dashboard/ingredients/new">
            <S.AddButton>+ Add Ingredient</S.AddButton>
          </Link>
        </S.EmptyState>
      ) : (
        <S.Table>
          <S.TableHeader>
            <S.TableRow>
              <S.TableHead>Ingredient</S.TableHead>
              <S.TableHead>Type</S.TableHead>
              <S.TableHead>Updated</S.TableHead>
              <S.TableHead>Actions</S.TableHead>
            </S.TableRow>
          </S.TableHeader>
          <S.TableBody>
            {ingredients.map((ingredient) => (
              <S.TableRow key={ingredient.id}>
                <S.TableCell>
                  <S.ProductInfo>
                    {ingredient.imageUrl ? (
                      <S.ProductImage>
                        <Image
                          src={ingredient.imageUrl}
                          alt={ingredient.name}
                          fill
                          sizes="48px"
                          style={{ objectFit: "cover" }}
                        />
                      </S.ProductImage>
                    ) : (
                      <S.ProductImagePlaceholder>
                        {ingredient.icon}
                      </S.ProductImagePlaceholder>
                    )}
                    <S.ProductDetails>
                      <S.ProductName>{ingredient.name}</S.ProductName>
                      <S.ProductSubtitle>{ingredient.icon}</S.ProductSubtitle>
                    </S.ProductDetails>
                  </S.ProductInfo>
                </S.TableCell>
                <S.TableCell>{ingredient.type}</S.TableCell>
                <S.TableCell>
                  {new Date(ingredient.updatedAt).toLocaleDateString()}
                </S.TableCell>
                <S.TableCell>
                  <S.Actions>
                    <Link href={`/dashboard/ingredients/${ingredient.id}`}>
                      <S.EditButton>Edit</S.EditButton>
                    </Link>
                    <S.DeleteButton
                      onClick={() =>
                        handleDelete(ingredient.id, ingredient.name)
                      }
                      disabled={deletingId === ingredient.id}
                    >
                      {deletingId === ingredient.id ? "..." : "Delete"}
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
