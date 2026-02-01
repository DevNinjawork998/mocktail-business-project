"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/app/actions/users";
import * as S from "./UsersListClient.styles";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  hasOAuthAccount: boolean;
}

interface UsersListClientProps {
  users: User[];
  currentUserId: string;
}

export default function UsersListClient({
  users,
  currentUserId,
}: UsersListClientProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user "${email}"?`)) {
      return;
    }

    setDeletingId(id);
    const result = await deleteUser(id);

    if (!result.success) {
      alert(result.error);
    }

    setDeletingId(null);
    router.refresh();
  };

  const getInitials = (name: string | null, email: string): string => {
    if (name) {
      const parts = name.split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return name[0].toUpperCase();
    }
    return email[0].toUpperCase();
  };

  return (
    <S.Container>
      <S.Header>
        <S.HeaderContent>
          <S.Title>Users</S.Title>
          <S.Subtitle>{users.length} users total</S.Subtitle>
        </S.HeaderContent>
        <Link href="/dashboard/users/new" aria-label="Add new user">
          <S.AddButton>+ Add User</S.AddButton>
        </Link>
      </S.Header>

      {users.length === 0 ? (
        <S.EmptyState>
          <S.EmptyIcon>👥</S.EmptyIcon>
          <S.EmptyTitle>No users yet</S.EmptyTitle>
          <S.EmptyText>Create your first user to get started.</S.EmptyText>
          <Link href="/dashboard/users/new">
            <S.AddButton>+ Add User</S.AddButton>
          </Link>
        </S.EmptyState>
      ) : (
        <S.Table role="table" aria-label="Users list">
          <S.TableHeader>
            <S.TableRow>
              <S.TableHead scope="col">User</S.TableHead>
              <S.TableHead scope="col">Role</S.TableHead>
              <S.TableHead scope="col">Auth Method</S.TableHead>
              <S.TableHead scope="col">Created</S.TableHead>
              <S.TableHead scope="col">Actions</S.TableHead>
            </S.TableRow>
          </S.TableHeader>
          <S.TableBody>
            {users.map((user) => (
              <S.TableRow key={user.id}>
                <S.TableCell>
                  <S.UserInfo>
                    {user.image ? (
                      <S.UserAvatar
                        style={{
                          backgroundImage: `url(${user.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        role="img"
                        aria-label={`Avatar for ${user.name || user.email}`}
                      />
                    ) : (
                      <S.UserAvatar
                        role="img"
                        aria-label={`Avatar initials for ${user.name || user.email}`}
                      >
                        {getInitials(user.name, user.email)}
                      </S.UserAvatar>
                    )}
                    <S.UserDetails>
                      <S.UserName>{user.name || user.email}</S.UserName>
                      <S.UserEmail>{user.email}</S.UserEmail>
                    </S.UserDetails>
                  </S.UserInfo>
                </S.TableCell>
                <S.TableCell>
                  <S.RoleBadge $role={user.role} aria-label={`User role: ${user.role}`}>
                    {user.role}
                  </S.RoleBadge>
                </S.TableCell>
                <S.TableCell>
                  {user.hasOAuthAccount ? (
                    <S.OAuthBadge aria-label="Authentication method: Google OAuth">
                      Google OAuth
                    </S.OAuthBadge>
                  ) : (
                    <S.OAuthBadge aria-label="Authentication method: Credentials">
                      Credentials
                    </S.OAuthBadge>
                  )}
                </S.TableCell>
                <S.TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </S.TableCell>
                <S.TableCell>
                  <S.Actions>
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      aria-label={`Edit user ${user.name || user.email}`}
                    >
                      <S.EditButton>Edit</S.EditButton>
                    </Link>
                    <S.DeleteButton
                      onClick={() => handleDelete(user.id, user.email)}
                      disabled={deletingId === user.id || user.id === currentUserId}
                      aria-label={`Delete user ${user.name || user.email}`}
                      aria-disabled={deletingId === user.id || user.id === currentUserId}
                    >
                      {deletingId === user.id ? "..." : "Delete"}
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
