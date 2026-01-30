"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Edit,
  Trash2,
  User as UserIcon,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { User } from "@/types";
import { UserEditModal } from "@/components/UserEditModal/UserEditModal";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toast";
import styles from "./UsersPage.module.css";

// Import API functions from the route file
import {
  getAllUsers,
  updateUser,
  deleteUser,
  type UpdateUserData,
} from "../../api/users/route";

export default function UsersPage() {
  const router = useRouter();
  const { user: currentUser, token } = useAuth();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Завантаження користувачів
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(token || ""),
    enabled: !!token && currentUser?.role === "admin",
  });

  // Мутація для оновлення користувача
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      updateUser(id, data, token || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("Користувача успішно оновлено");
      setIsEditModalOpen(false);
      setSelectedUser(null);
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Помилка оновлення користувача");
    },
  });

  // Мутація для видалення користувача
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id, token || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("Користувача успішно видалено");
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Помилка видалення користувача");
    },
  });

  // Фільтрація користувачів
  const filteredUsers = useMemo(() => {
    let result = users;

    // Фільтр за пошуком
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.phone && user.phone.toLowerCase().includes(query))
      );
    }

    // Фільтр за роллю
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    return result;
  }, [users, searchQuery, roleFilter]);

  // Статистика
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const admins = users.filter((user) => user.role === "admin").length;
    const regularUsers = users.filter((user) => user.role === "user").length;

    return { totalUsers, admins, regularUsers };
  }, [users]);

  // Форматування телефону для відображення
  const formatPhone = (phone?: string) => {
    if (!phone) return "Не вказано";
    // Якщо телефон починається з 380, форматуємо як +380 XX XXX XX XX
    if (phone.startsWith("380") && phone.length === 12) {
      return `+${phone.slice(0, 3)} ${phone.slice(3, 5)} ${phone.slice(
        5,
        8
      )} ${phone.slice(8, 10)} ${phone.slice(10)}`;
    }
    return phone;
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    if (user._id === currentUser?._id) {
      showErrorToast("Ви не можете видалити свій власний акаунт");
      return;
    }

    if (
      window.confirm(
        `Ви впевнені, що хочете видалити користувача "${user.name}"?`
      )
    ) {
      deleteUserMutation.mutate(user._id);
    }
  };

  const handleUpdateUser = (data: UpdateUserData) => {
    if (!selectedUser) return;
    updateUserMutation.mutate({ id: selectedUser._id, data });
  };

  // Перевірка доступу адміністратора
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p className={styles.errorMessage}>
            У вас немає доступу до цієї сторінки
          </p>
          <button
            onClick={() => router.push("/")}
            className={styles.retryButton}
          >
            На головну
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Завантаження користувачів...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p className={styles.errorMessage}>
            Помилка завантаження користувачів: {(error as Error).message}
          </p>
          <button onClick={() => refetch()} className={styles.retryButton}>
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>Управління користувачами</h1>
            <button
              onClick={() => router.push("/profile")}
              className={styles.backButton}
            >
              <ChevronLeft className={styles.icon} />
              Назад до профілю
            </button>
          </div>

          {/* Stats */}
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.totalUsers}</div>
              <div className={styles.statLabel}>Всього користувачів</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.regularUsers}</div>
              <div className={styles.statLabel}>Користувачі</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.admins}</div>
              <div className={styles.statLabel}>Адміністратори</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Пошук за ім'ям, email або телефоном..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filters}>
            <button
              onClick={() => setRoleFilter("all")}
              className={`${styles.filterButton} ${
                roleFilter === "all" ? styles.filterButtonActive : ""
              }`}
            >
              Всі
            </button>
            <button
              onClick={() => setRoleFilter("user")}
              className={`${styles.filterButton} ${
                roleFilter === "user" ? styles.filterButtonActive : ""
              }`}
            >
              Користувач
            </button>
            <button
              onClick={() => setRoleFilter("admin")}
              className={`${styles.filterButton} ${
                roleFilter === "admin" ? styles.filterButtonActive : ""
              }`}
            >
              Адміністратори
            </button>
          </div>
        </div>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>
              {searchQuery || roleFilter !== "all"
                ? "Користувачів не знайдено"
                : "Список користувачів порожній"}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className={styles.usersList}>
              {filteredUsers.map((user) => (
                <div key={user._id} className={styles.userCard}>
                  <div className={styles.userCardHeader}>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={styles.userAvatar}
                      />
                    ) : (
                      <div className={styles.userAvatarPlaceholder}>
                        <UserIcon className={styles.icon} />
                      </div>
                    )}
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>{user.name}</div>
                      <div className={styles.userEmail}>{user.email}</div>
                    </div>
                  </div>

                  <div className={styles.userDetails}>
                    <div className={styles.userDetailRow}>
                      <span className={styles.userDetailLabel}>Телефон:</span>
                      <span className={styles.userDetailValue}>
                        {formatPhone(user.phone)}
                      </span>
                    </div>
                    <div className={styles.userDetailRow}>
                      <span className={styles.userDetailLabel}>Роль:</span>
                      <span
                        className={`${styles.roleBadge} ${
                          user.role === "admin"
                            ? styles.roleBadgeAdmin
                            : styles.roleBadgeUser
                        }`}
                      >
                        {user.role === "admin" ? "Адміністратор" : "Користувач"}
                      </span>
                    </div>
                    <div className={styles.userDetailRow}>
                      <span className={styles.userDetailLabel}>
                        Зареєстрований:
                      </span>
                      <span className={styles.userDetailValue}>
                        {new Date(user.createdAt).toLocaleDateString("uk-UA")}
                      </span>
                    </div>
                  </div>

                  <div className={styles.userActions}>
                    <button
                      onClick={() => handleEditUser(user)}
                      className={styles.actionButton}
                    >
                      <Edit className={styles.smallIcon} />
                      Редагувати
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className={`${styles.actionButton} ${styles.actionButtonDelete}`}
                      disabled={user._id === currentUser._id}
                    >
                      <Trash2 className={styles.smallIcon} />
                      Видалити
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr className={styles.tableRow}>
                    <th className={styles.tableHeader}>Користувач</th>
                    <th className={styles.tableHeader}>Телефон</th>
                    <th className={styles.tableHeader}>Роль</th>
                    <th className={styles.tableHeader}>Дата реєстрації</th>
                    <th className={styles.tableHeader}>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        <div className={styles.userCellContent}>
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className={styles.tableAvatar}
                            />
                          ) : (
                            <div className={styles.tableAvatarPlaceholder}>
                              <UserIcon className={styles.icon} />
                            </div>
                          )}
                          <div className={styles.tableUserInfo}>
                            <div className={styles.tableUserName}>
                              {user.name}
                            </div>
                            <div className={styles.tableUserEmail}>
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        {formatPhone(user.phone)}
                      </td>
                      <td className={styles.tableCell}>
                        <span
                          className={`${styles.roleBadge} ${
                            user.role === "admin"
                              ? styles.roleBadgeAdmin
                              : styles.roleBadgeUser
                          }`}
                        >
                          {user.role === "admin"
                            ? "Адміністратор"
                            : "Користувач"}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        {new Date(user.createdAt).toLocaleDateString("uk-UA")}
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.tableActions}>
                          <button
                            onClick={() => handleEditUser(user)}
                            className={styles.tableActionButton}
                            title="Редагувати"
                          >
                            <Edit className={styles.smallIcon} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className={`${styles.tableActionButton} ${styles.tableActionButtonDelete}`}
                            disabled={user._id === currentUser._id}
                            title="Видалити"
                          >
                            <Trash2 className={styles.smallIcon} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={handleUpdateUser}
          isLoading={updateUserMutation.isPending}
        />
      )}
    </div>
  );
}
