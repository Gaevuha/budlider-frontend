"use client";

import Link from "next/link";
import { type RefObject } from "react";
import { User, LogOut, Settings, Users } from "lucide-react";
import { RiAdminFill } from "react-icons/ri";
import styles from "./ProfileMenu.module.css";

interface ProfileMenuProps {
  user: any;
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
  profileMenuRef: RefObject<HTMLDivElement>;
}

export function ProfileMenu({
  user,
  isProfileMenuOpen,
  setIsProfileMenuOpen,
  handleLogout,
  profileMenuRef,
}: ProfileMenuProps) {
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

          <Link href="/profile" className={styles.profileDropdownItem}>
            <User className={styles.profileMenuIcon} />
            Профіль
          </Link>

          {user.role === "admin" && (
            <>
              <Link href="/admin/users" className={styles.profileDropdownItem}>
                <Users className={styles.profileMenuIcon} />
                Управління користувачами
              </Link>
              <Link href="/admin/orders" className={styles.profileDropdownItem}>
                <Settings className={styles.profileMenuIcon} />
                Адмін-панель
              </Link>
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
