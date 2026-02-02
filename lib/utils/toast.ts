let toastPromise: Promise<any> | null = null;

const loadToast = async () => {
  if (typeof window === "undefined") return null;
  if (!toastPromise) {
    toastPromise = Promise.all([
      import("izitoast"),
      import("izitoast/dist/css/iziToast.min.css"),
    ]).then(([module]) => module?.default || module);
  }
  return toastPromise;
};

// Налаштування за замовчуванням
const defaultConfig = {
  position: "topRight" as const,
  timeout: 3000,
  transitionIn: "fadeInDown" as const,
  transitionOut: "fadeOutUp" as const,
  progressBar: true,
  close: true,
  pauseOnHover: true,
  resetOnHover: true,
  theme: "light" as const,
};

export const toast = {
  success: (message: string, title = "Успіх") => {
    loadToast().then((iziToast) => {
      if (!iziToast) return;
      iziToast.success({
        ...defaultConfig,
        title,
        message,
        backgroundColor: "#16a34a",
        titleColor: "#ffffff",
        messageColor: "#ffffff",
        icon: "ico-success",
        iconColor: "#ffffff",
      });
    });
  },

  error: (message: string, title = "Помилка") => {
    loadToast().then((iziToast) => {
      if (!iziToast) return;
      iziToast.error({
        ...defaultConfig,
        title,
        message,
        backgroundColor: "#dc2626",
        titleColor: "#ffffff",
        messageColor: "#ffffff",
        icon: "ico-error",
        iconColor: "#ffffff",
      });
    });
  },

  warning: (message: string, title = "Увага") => {
    loadToast().then((iziToast) => {
      if (!iziToast) return;
      iziToast.warning({
        ...defaultConfig,
        title,
        message,
        backgroundColor: "#f59e0b",
        titleColor: "#ffffff",
        messageColor: "#ffffff",
        icon: "ico-warning",
        iconColor: "#ffffff",
      });
    });
  },

  info: (message: string, title = "Інформація") => {
    loadToast().then((iziToast) => {
      if (!iziToast) return;
      iziToast.info({
        ...defaultConfig,
        title,
        message,
        backgroundColor: "#3b82f6",
        titleColor: "#ffffff",
        messageColor: "#ffffff",
        icon: "ico-info",
        iconColor: "#ffffff",
      });
    });
  },

  custom: (options: any) => {
    loadToast().then((iziToast) => {
      if (!iziToast) return;
      iziToast.show({
        ...defaultConfig,
        ...options,
      });
    });
  },
};

// Алиаси для зручності
export const showSuccessToast = (message: string, title = "Успіх") =>
  toast.success(message, title);
export const showErrorToast = (message: string, title = "Помилка") =>
  toast.error(message, title);
export const showWarningToast = (message: string, title = "Увага") =>
  toast.warning(message, title);
export const showInfoToast = (message: string, title = "Інформація") =>
  toast.info(message, title);
