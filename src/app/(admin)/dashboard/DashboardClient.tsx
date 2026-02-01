"use client";

import Link from "next/link";
import * as S from "./DashboardClient.styles";

interface DashboardClientProps {
  productCount: number;
  ingredientCount: number;
  recentProducts: Array<{
    id: string;
    name: string;
    updatedAt: Date;
  }>;
}

export default function DashboardClient({
  productCount,
  ingredientCount,
  recentProducts,
}: DashboardClientProps) {
  return (
    <S.Container>
      <S.Header>
        <S.Title>Dashboard</S.Title>
        <S.Subtitle>Welcome to the admin dashboard</S.Subtitle>
      </S.Header>

      <S.StatsGrid>
        <S.StatCard>
          <S.StatIcon>🍹</S.StatIcon>
          <S.StatContent>
            <S.StatValue>{productCount}</S.StatValue>
            <S.StatLabel>Products</S.StatLabel>
          </S.StatContent>
          <Link href="/dashboard/products">
            <S.StatLink>View all</S.StatLink>
          </Link>
        </S.StatCard>

        <S.StatCard>
          <S.StatIcon>🌿</S.StatIcon>
          <S.StatContent>
            <S.StatValue>{ingredientCount}</S.StatValue>
            <S.StatLabel>Ingredients</S.StatLabel>
          </S.StatContent>
          <Link href="/dashboard/ingredients">
            <S.StatLink>View all</S.StatLink>
          </Link>
        </S.StatCard>
      </S.StatsGrid>

      <S.Section>
        <S.SectionHeader>
          <S.SectionTitle>Recent Activity</S.SectionTitle>
          <Link href="/dashboard/products">
            <S.ViewAllLink>View all products</S.ViewAllLink>
          </Link>
        </S.SectionHeader>

        <S.ActivityList>
          {recentProducts.length === 0 ? (
            <S.EmptyState>No products yet. Create your first product!</S.EmptyState>
          ) : (
            recentProducts.map((product) => (
              <S.ActivityItem key={product.id}>
                <S.ActivityIcon>🍹</S.ActivityIcon>
                <S.ActivityContent>
                  <S.ActivityName>{product.name}</S.ActivityName>
                  <S.ActivityTime>
                    Updated {new Date(product.updatedAt).toLocaleDateString()}
                  </S.ActivityTime>
                </S.ActivityContent>
                <Link href={`/dashboard/products/${product.id}`}>
                  <S.EditLink>Edit</S.EditLink>
                </Link>
              </S.ActivityItem>
            ))
          )}
        </S.ActivityList>
      </S.Section>

      <S.QuickActions>
        <S.SectionTitle>Quick Actions</S.SectionTitle>
        <S.ActionButtons>
          <Link href="/dashboard/products/new">
            <S.ActionButton $variant="primary">
              <span>+</span> New Product
            </S.ActionButton>
          </Link>
          <Link href="/dashboard/ingredients/new">
            <S.ActionButton $variant="secondary">
              <span>+</span> New Ingredient
            </S.ActionButton>
          </Link>
        </S.ActionButtons>
      </S.QuickActions>
    </S.Container>
  );
}
