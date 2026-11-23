import toast from 'react-hot-toast';

export const toastSuccess = (msg) => toast.success(msg);
export const toastError   = (msg) => toast.error(msg);
export const toastLoading = (msg) => toast.loading(msg);
export const toastDismiss = (id)  => toast.dismiss(id);

// Wraps an async fn — shows loading → success/error automatically
export const toastPromise = (promise, { loading, success, error }) =>
  toast.promise(promise, { loading, success, error });

export default toast;
