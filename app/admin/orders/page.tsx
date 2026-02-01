"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchAllOrdersClient,
  updateOrderStatusClient,
} from "@/lib/api/apiClient";
import { Order } from "@/types";
import {
  Download,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Package,
  X,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { toast } from "@/lib/utils/toast";
import React from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./AdminOrdersPage.module.css";

type DateRange = [Date | null, Date | null];

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>([null, null]);

  const isAdmin = useMemo(() => user?.role === "admin", [user?.role]);

  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
      return;
    }

    loadOrders();
  }, [isAdmin, router]);

  const loadOrders = async () => {
    try {
      const res = await fetchAllOrdersClient();
      const data = res?.data?.orders || res?.orders || res || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    await updateOrderStatusClient(orderId, { status: newStatus });
    loadOrders();
    toast.success("Статус замовлення оновлено");
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm("Скасувати це замовлення?")) {
      handleStatusChange(orderId, "cancelled");
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm("Видалити це замовлення?")) {
      handleStatusChange(orderId, "cancelled");
    }
  };

  const handleExportToCSV = () => {
    const headers = [
      "ID",
      "Дата",
      "Клієнт",
      "Телефон",
      "Email",
      "Адреса",
      "Сума",
      "Статус",
      "Тип",
      "Коментар",
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      new Date(order.createdAt).toLocaleDateString("uk-UA"),
      order.customerName,
      order.customerPhone,
      order.customerEmail || "-",
      order.deliveryAddress,
      order.total,
      order.status,
      order.type || "product",
      order.comment || "-",
    ]);

    const escapeCSV = (value: any): string => {
      const str = String(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `orders_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Замовлення експортовано в CSV");
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.customerName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (order.customerPhone || "").includes(searchQuery) ||
      (order.id || "").includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    const matchesDateRange =
      !dateRange[0] ||
      !dateRange[1] ||
      (new Date(order.createdAt) >= dateRange[0] &&
        new Date(order.createdAt) <= dateRange[1]);

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  if (!isAdmin) {
    return null;
  }

  const getStatusClassName = (status: Order["status"]) => {
    const statusMap = {
      new: styles.statusNew,
      pending: styles.statusPending,
      processing: styles.statusProcessing,
      paid: styles.statusPaid,
      shipped: styles.statusShipped,
      completed: styles.statusCompleted,
      cancelled: styles.statusCancelled,
    };
    return `${styles.statusSelect} ${statusMap[status] || ""}`;
  };

  const getTypeBadgeClassName = (type: string) => {
    if (type === "quick") return `${styles.typeBadge} ${styles.typeBadgeQuick}`;
    if (type === "service")
      return `${styles.typeBadge} ${styles.typeBadgeService}`;
    return `${styles.typeBadge} ${styles.typeBadgeProduct}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>Управління замовленнями</h1>
          <button
            onClick={() => router.push("/profile")}
            className={styles.backButton}
          >
            <ArrowLeft className={styles.icon} />
            Назад до профілю
          </button>
        </div>
        <button onClick={handleExportToCSV} className={styles.exportButton}>
          <Download className={styles.icon} />
          Експорт в CSV
        </button>
      </div>

      <div className={styles.filtersCard}>
        <div className={styles.filtersGrid}>
          <div className={styles.filterField}>
            <Search className={styles.filterIcon} />
            <input
              type="text"
              placeholder="Пошук по імені, телефону або ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterField}>
            <Filter className={styles.filterIcon} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Всі статуси</option>
              <option value="new">Нові</option>
              <option value="processing">В обробці</option>
              <option value="shipped">Відправлені</option>
              <option value="completed">Виконані</option>
              <option value="cancelled">Скасовані</option>
            </select>
          </div>

          <div className={styles.filterField}>
            <Calendar className={styles.filterIcon} />
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={styles.dateButton}
            >
              {dateRange[0] && dateRange[1]
                ? `${dateRange[0].toLocaleDateString(
                    "uk-UA"
                  )} - ${dateRange[1].toLocaleDateString("uk-UA")}`
                : "Виберіть діапазон дат"}
            </button>
            {dateRange[0] && dateRange[1] && (
              <button
                onClick={() => setDateRange([null, null])}
                className={styles.clearDateButton}
              >
                <X className={styles.smallIcon} />
              </button>
            )}
            {showDatePicker && (
              <div className={styles.calendarWrapper}>
                <ReactCalendar
                  onChange={(value) => {
                    if (Array.isArray(value)) {
                      setDateRange(value);
                    } else {
                      setDateRange([value, value]);
                    }
                    setShowDatePicker(false);
                  }}
                  value={dateRange}
                  selectRange
                  locale="uk-UA"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Всього</p>
          <p className={styles.statValue}>{orders.length}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Нові</p>
          <p className={`${styles.statValue} ${styles.statValueBlue}`}>
            {orders.filter((o) => o.status === "new").length}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>В обробці</p>
          <p className={`${styles.statValue} ${styles.statValueYellow}`}>
            {orders.filter((o) => o.status === "processing").length}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Виконані</p>
          <p className={`${styles.statValue} ${styles.statValueGreen}`}>
            {orders.filter((o) => o.status === "completed").length}
          </p>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>ID</th>
                <th>Дата</th>
                <th>Клієнт</th>
                <th>Телефон</th>
                <th>Сума</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyRow}>
                    Замовлень не знайдено
                  </td>
                </tr>
              ) : (
                filteredOrders.flatMap((order) => [
                  <tr key={order.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <button
                        onClick={() =>
                          setExpandedOrderId(
                            expandedOrderId === order.id ? null : order.id
                          )
                        }
                        className={styles.expandButton}
                      >
                        {expandedOrderId === order.id ? (
                          <ChevronUp className={styles.smallIcon} />
                        ) : (
                          <ChevronDown className={styles.smallIcon} />
                        )}
                        #{order.id}
                      </button>
                    </td>
                    <td className={styles.tableCell}>
                      {new Date(order.createdAt).toLocaleDateString("uk-UA")}
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.customerName}>
                        {order.customerName || "-"}
                      </div>
                      {order.type && (
                        <span className={getTypeBadgeClassName(order.type)}>
                          {order.type === "quick"
                            ? "Швидке"
                            : order.type === "service"
                            ? "Послуга"
                            : "Товар"}
                        </span>
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      {order.customerPhone || "-"}
                    </td>
                    <td className={`${styles.tableCell} ${styles.totalCell}`}>
                      {order.total} грн
                    </td>
                    <td className={styles.tableCell}>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value as Order["status"]
                          )
                        }
                        className={getStatusClassName(order.status)}
                      >
                        <option value="new">Нове</option>
                        <option value="pending">Очікує</option>
                        <option value="processing">В обробці</option>
                        <option value="paid">Оплачено</option>
                        <option value="shipped">Відправлено</option>
                        <option value="completed">Виконано</option>
                        <option value="cancelled">Скасовано</option>
                      </select>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionsCell}>
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={order.status === "cancelled"}
                          className={styles.cancelButton}
                        >
                          <X className={styles.smallIcon} />
                          Скасувати
                        </button>
                        <span className={styles.divider}>|</span>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className={styles.deleteButton}
                        >
                          Видалити
                        </button>
                      </div>
                    </td>
                  </tr>,

                  ...(expandedOrderId === order.id
                    ? [
                        <tr
                          key={`${order.id}-details`}
                          className={styles.detailsRow}
                        >
                          <td colSpan={7} className={styles.detailsCell}>
                            <div className={styles.detailsGrid}>
                              <div className={styles.detailsSection}>
                                <h4 className={styles.detailsTitle}>
                                  <Package className={styles.smallIcon} />
                                  Інформація про клієнта
                                </h4>
                                <div className={styles.detailsList}>
                                  <div className={styles.detailsItem}>
                                    <span className={styles.detailsLabel}>
                                      Ім'я:
                                    </span>
                                    <span className={styles.detailsValue}>
                                      {order.customerName || "Не вказано"}
                                    </span>
                                  </div>
                                  <div className={styles.detailsItem}>
                                    <span className={styles.detailsLabel}>
                                      Телефон:
                                    </span>
                                    <span className={styles.detailsValue}>
                                      {order.customerPhone || "Не вказано"}
                                    </span>
                                  </div>
                                  {order.customerEmail && (
                                    <div className={styles.detailsItem}>
                                      <span className={styles.detailsLabel}>
                                        Email:
                                      </span>
                                      <span className={styles.detailsValue}>
                                        {order.customerEmail}
                                      </span>
                                    </div>
                                  )}
                                  {order.deliveryAddress && (
                                    <div className={styles.detailsItem}>
                                      <span className={styles.detailsLabel}>
                                        Адреса:
                                      </span>
                                      <span className={styles.detailsValue}>
                                        {order.deliveryAddress}
                                      </span>
                                    </div>
                                  )}
                                  {order.comment && (
                                    <div className={styles.detailsItem}>
                                      <span className={styles.detailsLabel}>
                                        Коментар:
                                      </span>
                                      <span className={styles.detailsValue}>
                                        {order.comment}
                                      </span>
                                    </div>
                                  )}
                                  {order.serviceName && (
                                    <div className={styles.detailsItem}>
                                      <span className={styles.detailsLabel}>
                                        Послуга:
                                      </span>
                                      <span className={styles.detailsValue}>
                                        {order.serviceName}
                                      </span>
                                    </div>
                                  )}
                                  <div className={styles.detailsItem}>
                                    <span className={styles.detailsLabel}>
                                      Оплата:
                                    </span>
                                    <span className={styles.detailsValue}>
                                      {order.paymentMethod === "cash"
                                        ? "Готівка"
                                        : order.paymentMethod ===
                                          "card_delivery"
                                        ? "Карта при доставці"
                                        : order.paymentMethod === "card_online"
                                        ? "Онлайн оплата"
                                        : order.paymentMethod}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className={styles.detailsSection}>
                                <h4 className={styles.detailsTitle}>
                                  Товари у замовленні
                                </h4>
                                {order.items && order.items.length > 0 ? (
                                  <div className={styles.orderItems}>
                                    {order.items.map((item, index) => (
                                      <div
                                        key={`${order.id}-item-${index}`}
                                        className={styles.orderItem}
                                      >
                                        <div className={styles.orderItemInfo}>
                                          <div className={styles.orderItemName}>
                                            {item.name || "Товар без назви"}
                                          </div>
                                          <div
                                            className={styles.orderItemDetails}
                                          >
                                            {item.quantity} шт × {item.price}{" "}
                                            грн
                                          </div>
                                        </div>
                                        <div className={styles.orderItemTotal}>
                                          {item.total} грн
                                        </div>
                                      </div>
                                    ))}
                                    <div className={styles.orderTotal}>
                                      <span>Всього:</span>
                                      <span className={styles.orderTotalValue}>
                                        {order.total} грн
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <p className={styles.emptyMessage}>
                                    Товари відсутні
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>,
                      ]
                    : []),
                ])
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
