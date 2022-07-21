import { useModalStore } from "../store"

export const copyToClipboard = (text: string, msg?: string) => {
  navigator.clipboard.writeText(text)
  useModalStore.getState().toast(msg ?? "Copied to clipboard", 'success')
}