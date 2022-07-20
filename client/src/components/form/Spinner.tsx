export const Spinner: React.FC<{ label: string }> = ({ label }) => {
  return (
    <>
      <span className="spinner-grow spinner-grow-sm me-3" role="status" aria-hidden="true" />
      {label}
    </>
  )
}
