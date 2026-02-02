"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchAllOrdersClient,
  deleteOrderAdminClient,
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

  const getOrderId = (order: any) => order?.id || order?._id || order?.orderId;

  const getOrderCreatedAt = (order: any) =>
    order?.createdAt || order?.created_at || order?.date;

  const getCustomerName = (order: any) =>
    order?.customerName ||
    order?.shippingAddress?.name ||
    order?.name ||
    order?.user?.name;

  const getCustomerPhone = (order: any) =>
    order?.customerPhone ||
    order?.shippingAddress?.phone ||
    order?.phone ||
    order?.user?.phone;

  const getCustomerEmail = (order: any) =>
    order?.customerEmail || order?.email || order?.user?.email;

  const getOrderType = (order: any) =>
    order?.type || order?.orderType || (order?.isQuick ? "quick" : "product");

  const getOrderStatus = (order: any) => {
    if (order?.status === "new") return "pending";
    if (order?.status === "completed") return "received";
    return order?.status || "pending";
  };
  const getDisplayStatus = (order: any) =>
    getOrderStatus(order) === "pending" ? "new" : getOrderStatus(order);

  const buildAddressFromShipping = (shipping: any) => {
    if (!shipping) return undefined;
    if (typeof shipping === "string") return shipping;

    if (shipping.address) return shipping.address;

    const parts = [
      shipping.city,
      shipping.street,
      shipping.building,
      shipping.apartment || shipping.flat,
      shipping.department,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : undefined;
  };

  const getDeliveryAddress = (order: any) =>
    order?.deliveryAddress || buildAddressFromShipping(order?.shippingAddress);

  const normalizeItems = (items: any[]) =>
    Array.isArray(items)
      ? items.map((item) => {
          const quantity = Number(item?.quantity ?? item?.qty ?? 1);
          const price = Number(
            item?.price ?? item?.product?.price ?? item?.productPrice ?? 0
          );
          return {
            ...item,
            name: item?.name || item?.product?.name,
            price,
            quantity,
            total: Number(item?.total ?? price * quantity),
          };
        })
      : [];

  const getOrderTotal = (order: any) => {
    if (typeof order?.total === "number") return order.total;
    if (typeof order?.totalAmount === "number") return order.totalAmount;
    if (typeof order?.amount === "number") return order.amount;
    if (typeof order?.sum === "number") return order.sum;

    const items = normalizeItems(order?.items || []);
    return items.reduce((sum, item) => sum + Number(item?.total || 0), 0);
  };

  const getItemsSubtotal = (order: any) => {
    const items = normalizeItems(order?.items || []);
    return items.reduce((sum, item) => sum + Number(item?.total || 0), 0);
  };

  useEffect(() => {
    if (!user) return;
    if (!isAdmin) {
      router.push("/");
      return;
    }

    loadOrders();
  }, [user, isAdmin, router]);

  const loadOrders = async () => {
    try {
      const res = await fetchAllOrdersClient();
      const data = res?.data?.orders || res?.orders || res || [];
      const normalized = Array.isArray(data)
        ? data.map((order: any) => ({
            ...order,
            id: getOrderId(order),
            createdAt: getOrderCreatedAt(order),
            customerName: getCustomerName(order),
            customerPhone: getCustomerPhone(order),
            customerEmail: getCustomerEmail(order),
            deliveryAddress: getDeliveryAddress(order),
            total: getOrderTotal(order),
            status: getOrderStatus(order),
            type: getOrderType(order),
            items: normalizeItems(order?.items || []),
          }))
        : [];
      setOrders(normalized as Order[]);
    } catch {
      setOrders([]);
    }
  };

  const normalizeStatusForApi = (value: string): Order["status"] => {
    if (value === "new") return "pending";
    if (
      value === "pending" ||
      value === "processing" ||
      value === "paid" ||
      value === "shipped" ||
      value === "cancelled" ||
      value === "received"
    ) {
      return value;
    }
    return "pending";
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const normalized = normalizeStatusForApi(newStatus);
      await updateOrderStatusClient(orderId, { status: normalized });
      loadOrders();
      toast.success("Статус замовлення оновлено");
    } catch (error) {
      toast.error("Не вдалося оновити статус замовлення");
    }
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm("Скасувати це замовлення?")) {
      handleStatusChange(orderId, "cancelled");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Видалити це замовлення?")) return;
    try {
      await deleteOrderAdminClient(orderId);
      loadOrders();
      toast.success("Замовлення видалено");
    } catch (error) {
      toast.error("Не вдалося видалити замовлення");
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
      getOrderId(order),
      new Date(getOrderCreatedAt(order)).toLocaleDateString("uk-UA"),
      getCustomerName(order) || "-",
      getCustomerPhone(order) || "-",
      getCustomerEmail(order) || "-",
      getDeliveryAddress(order) || "-",
      getOrderTotal(order),
      getOrderStatus(order),
      getOrderType(order) || "product",
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
      (getCustomerName(order) || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (getCustomerPhone(order) || "").includes(searchQuery) ||
      String(getOrderId(order) || "").includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || getOrderStatus(order) === statusFilter;

    const matchesDateRange =
      !dateRange[0] ||
      !dateRange[1] ||
      (new Date(getOrderCreatedAt(order)) >= dateRange[0] &&
        new Date(getOrderCreatedAt(order)) <= dateRange[1]);

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  const getStatusClassName = (status: Order["status"]) => {
    const effectiveStatus =
      status === "pending"
        ? "new"
        : status === "received"
        ? "completed"
        : status;
    const statusMap = {
      new: styles.statusNew,
      pending: styles.statusPending,
      processing: styles.statusProcessing,
      paid: styles.statusPaid,
      shipped: styles.statusShipped,
      completed: styles.statusCompleted,
      cancelled: styles.statusCancelled,
    };
    return `${styles.statusSelect} ${statusMap[effectiveStatus] || ""}`;
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
              <option value="pending">Нові</option>
              <option value="processing">В обробці</option>
              <option value="paid">Оплачено</option>
              <option value="shipped">Відправлено</option>
              <option value="received">Отримано</option>
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
            {orders.filter((o) => getDisplayStatus(o) === "new").length}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>В обробці</p>
          <p className={`${styles.statValue} ${styles.statValueYellow}`}>
            {orders.filter((o) => getDisplayStatus(o) === "processing").length}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Відправлено</p>
          <p className={`${styles.statValue} ${styles.statValueDarkGreen}`}>
            {orders.filter((o) => getOrderStatus(o) === "shipped").length}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Отримано</p>
          <p className={`${styles.statValue} ${styles.statValueGreen}`}>
            {orders.filter((o) => getOrderStatus(o) === "received").length}
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
                  <tr key={getOrderId(order)} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <button
                        onClick={() =>
                          setExpandedOrderId(
                            expandedOrderId === getOrderId(order)
                              ? null
                              : getOrderId(order)
                          )
                        }
                        className={styles.expandButton}
                      >
                        {expandedOrderId === getOrderId(order) ? (
                          <ChevronUp className={styles.smallIcon} />
                        ) : (
                          <ChevronDown className={styles.smallIcon} />
                        )}
                        #{getOrderId(order)}
                      </button>
                    </td>
                    <td className={styles.tableCell}>
                      {new Date(getOrderCreatedAt(order)).toLocaleDateString(
                        "uk-UA"
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.customerName}>
                        {getCustomerName(order) || "-"}
                      </div>
                      {getOrderType(order) && (
                        <span
                          className={getTypeBadgeClassName(getOrderType(order))}
                        >
                          {getOrderType(order) === "quick"
                            ? "Швидке"
                            : getOrderType(order) === "service"
                            ? "Послуга"
                            : "Товар"}
                        </span>
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      {getCustomerPhone(order) || "-"}
                    </td>
                    <td className={`${styles.tableCell} ${styles.totalCell}`}>
                      {getOrderTotal(order)} грн
                    </td>
                    <td className={styles.tableCell}>
                      <select
                        value={getOrderStatus(order)}
                        onChange={(e) =>
                          handleStatusChange(getOrderId(order), e.target.value)
                        }
                        className={getStatusClassName(getOrderStatus(order))}
                      >
                        <option value="pending">Нове</option>
                        <option value="processing">В обробці</option>
                        <option value="paid">Оплачено</option>
                        <option value="shipped">Відправлено</option>
                        <option value="received">Отримано</option>
                        <option value="cancelled">Скасовано</option>
                      </select>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionsCell}>
                        <button
                          onClick={() => handleCancelOrder(getOrderId(order))}
                          disabled={getOrderStatus(order) === "cancelled"}
                          className={styles.cancelButton}
                        >
                          <X className={styles.smallIcon} />
                          Скасувати
                        </button>
                        <span className={styles.divider}>|</span>
                        <button
                          onClick={() => handleDeleteOrder(getOrderId(order))}
                          className={styles.deleteButton}
                        >
                          Видалити
                        </button>
                      </div>
                    </td>
                  </tr>,

                  ...(expandedOrderId === getOrderId(order)
                    ? [
                        <tr
                          key={`${getOrderId(order)}-details`}
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
                                      {getCustomerName(order) || "Не вказано"}
                                    </span>
                                  </div>
                                  <div className={styles.detailsItem}>
                                    <span className={styles.detailsLabel}>
                                      Телефон:
                                    </span>
                                    <span className={styles.detailsValue}>
                                      {getCustomerPhone(order) || "Не вказано"}
                                    </span>
                                  </div>
                                  {getCustomerEmail(order) && (
                                    <div className={styles.detailsItem}>
                                      <span className={styles.detailsLabel}>
                                        Email:
                                      </span>
                                      <span className={styles.detailsValue}>
                                        {getCustomerEmail(order)}
                                      </span>
                                    </div>
                                  )}
                                  {getDeliveryAddress(order) && (
                                    <div className={styles.detailsItem}>
                                      <span className={styles.detailsLabel}>
                                        Адреса:
                                      </span>
                                      <span className={styles.detailsValue}>
                                        {getDeliveryAddress(order)}
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
                                        key={`${getOrderId(
                                          order
                                        )}-item-${index}`}
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
                                    {getOrderTotal(order) >
                                      getItemsSubtotal(order) && (
                                      <div className={styles.orderItem}>
                                        <div className={styles.orderItemInfo}>
                                          <div className={styles.orderItemName}>
                                            Доставка
                                          </div>
                                        </div>
                                        <div className={styles.orderItemTotal}>
                                          {getOrderTotal(order) -
                                            getItemsSubtotal(order)}{" "}
                                          грн
                                        </div>
                                      </div>
                                    )}
                                    <div className={styles.orderTotal}>
                                      <span>Всього:</span>
                                      <span className={styles.orderTotalValue}>
                                        {getOrderTotal(order)} грн
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
