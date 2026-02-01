"use client";

import { useRouter } from "next/navigation";
import { User, LogOut, Settings, Users } from "lucide-react";
import { RiAdminFill } from "react-icons/ri";
import styles from "./ProfileMenu.module.css";

interface ProfileMenuProps {
  user: any;
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
  profileMenuRef: React.RefObject<HTMLDivElement>;
}

export function ProfileMenu({
  user,
  isProfileMenuOpen,
  setIsProfileMenuOpen,
  handleLogout,
  profileMenuRef,
}: ProfileMenuProps) {
  const router = useRouter();

  const handleProfileClick = () => {
    setIsProfileMenuOpen(false);
    router.push("/profile");
  };

  const handleAdminUsersClick = () => {
    setIsProfileMenuOpen(false);
    router.push("/admin/users");
  };

  const handleAdminOrdersClick = () => {
    setIsProfileMenuOpen(false);
    router.push("/admin/orders");
  };

  return (
    <div className={styles.profileWrapper} ref={profileMenuRef}>
      <button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className={styles.profileButton}
        type="button"
      >
        <RiAdminFill className={styles.iconAdmin} />
        <span className={styles.userName}>{user.name}</span>
      </button>

      {isProfileMenuOpen && (
        <div className={styles.profileDropdown}>
          <div className={styles.profileDropdownHeader}>
            <p className={styles.profileDropdownName}>{user.name}</p>
            <p className={styles.profileDropdownEmail}>{user.email}</p>
          </div>

          <button
            onClick={handleProfileClick}
            className={styles.profileDropdownItem}
            type="button"
          >
            <User className={styles.profileMenuIcon} />
            Профіль
          </button>

          {user.role === "admin" && (
            <>
              <button
                onClick={handleAdminUsersClick}
                className={styles.profileDropdownItem}
                type="button"
              >
                <Users className={styles.profileMenuIcon} />
                Управління користувачами
              </button>
              <button
                onClick={handleAdminOrdersClick}
                className={styles.profileDropdownItem}
                type="button"
              >
                <Settings className={styles.profileMenuIcon} />
                Адмін-панель
              </button>
            </>
          )}

          <button
            onClick={handleLogout}
            className={styles.profileDropdownItem}
            type="button"
          >
            <LogOut className={styles.profileMenuIcon} />
            Вийти
          </button>
        </div>
      )}
    </div>
  );
}
