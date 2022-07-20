import { useModalStore } from "../store"

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  useModalStore.getState().toast("Copied to clipboard", 'success')
}