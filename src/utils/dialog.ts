/**
 * 全局弹窗工具
 * 统一的弹窗样式和标题
 */
import { createApp, h, ref } from 'vue'
// @ts-ignore
import Dialog from '../components/Dialog.vue'

interface DialogOptions {
  type?: 'success' | 'error' | 'warning' | 'info'
  message: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  onConfirm?: () => void
  onCancel?: () => void
}

/**
 * 显示弹窗
 */
export function showDialog(options: DialogOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const app = createApp({
      setup() {
        const visible = ref(true)

        const handleConfirm = () => {
          options.onConfirm?.()
          cleanup()
          resolve(true)
        }

        const handleCancel = () => {
          options.onCancel?.()
          cleanup()
          resolve(false)
        }

        const handleClose = () => {
          cleanup()
          resolve(false)
        }

        const cleanup = () => {
          visible.value = false
          setTimeout(() => {
            app.unmount()
            document.body.removeChild(container)
          }, 300)
        }

        return () =>
          h(Dialog, {
            visible: visible.value,
            type: options.type,
            message: options.message,
            confirmText: options.confirmText || '确定',
            cancelText: options.cancelText || '取消',
            showCancel: options.showCancel || false,
            onConfirm: handleConfirm,
            onCancel: handleCancel,
            onClose: handleClose,
            'onUpdate:visible': (val: boolean) => {
              if (!val) handleClose()
            }
          })
      }
    })

    app.mount(container)
  })
}

/**
 * 显示成功提示
 */
export function showSuccess(message: string): Promise<boolean> {
  return showDialog({
    type: 'success',
    message
  })
}

/**
 * 显示错误提示
 */
export function showError(message: string): Promise<boolean> {
  return showDialog({
    type: 'error',
    message
  })
}

/**
 * 显示警告提示
 */
export function showWarning(message: string): Promise<boolean> {
  return showDialog({
    type: 'warning',
    message
  })
}

/**
 * 显示信息提示
 */
export function showInfo(message: string): Promise<boolean> {
  return showDialog({
    type: 'info',
    message
  })
}

/**
 * 显示确认对话框
 */
export function showConfirm(message: string, options?: {
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'info'
}): Promise<boolean> {
  return showDialog({
    type: options?.type || 'warning',
    message,
    confirmText: options?.confirmText,
    cancelText: options?.cancelText,
    showCancel: true
  })
}

// 兼容原有的 alert 和 confirm
export function alert(message: string): Promise<boolean> {
  return showInfo(message)
}

export function confirm(message: string): Promise<boolean> {
  return showConfirm(message)
}
