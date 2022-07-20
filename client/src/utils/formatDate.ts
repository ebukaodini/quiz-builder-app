export const formatDate = (date: string) => {
  const dateObj = new Date(date)
  return `${dateObj?.getDate().toString().padStart(2, '0')}/${(dateObj?.getMonth() + 1).toString().padStart(2, '0')}/${dateObj?.getFullYear()}`
}

export const formatDateInput = (date: string) => {
  const dateObj = new Date(date)
  return `${dateObj?.getFullYear()}-${(dateObj?.getMonth() + 1).toString().padStart(2, '0')}-${dateObj?.getDate().toString().padStart(2, '0')}`
}