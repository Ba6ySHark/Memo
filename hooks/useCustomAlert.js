import { useState, useCallback } from 'react';

export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {},
    onCancel: () => {},
    confirmText: 'OK',
    cancelText: 'Cancel',
    showCancel: false,
  });

  const showAlert = useCallback(({
    title,
    message = '',
    type = 'info',
    onConfirm = () => {},
    onCancel = () => {},
    confirmText = 'OK',
    cancelText = 'Cancel',
    showCancel = false,
  }) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      onConfirm: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        onConfirm();
      },
      onCancel: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        onCancel();
      },
      confirmText,
      cancelText,
      showCancel,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  }, []);

  const showSuccess = useCallback((title, message = '', onConfirm = () => {}) => {
    showAlert({
      title,
      message,
      type: 'success',
      onConfirm,
    });
  }, [showAlert]);

  const showError = useCallback((title, message = '', onConfirm = () => {}) => {
    showAlert({
      title,
      message,
      type: 'error',
      onConfirm,
    });
  }, [showAlert]);

  const showWarning = useCallback((title, message = '', onConfirm = () => {}) => {
    showAlert({
      title,
      message,
      type: 'warning',
      onConfirm,
    });
  }, [showAlert]);

  const showInfo = useCallback((title, message = '', onConfirm = () => {}) => {
    showAlert({
      title,
      message,
      type: 'info',
      onConfirm,
    });
  }, [showAlert]);

  const showConfirm = useCallback(({
    title,
    message = '',
    onConfirm = () => {},
    onCancel = () => {},
    confirmText = 'Confirm',
    cancelText = 'Cancel',
  }) => {
    showAlert({
      title,
      message,
      type: 'warning',
      onConfirm,
      onCancel,
      confirmText,
      cancelText,
      showCancel: true,
    });
  }, [showAlert]);

  return {
    alertConfig,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };
}; 