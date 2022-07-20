export const ErrorList: React.FC<{ errors: string[] }> = ({ errors }) => {
  return (
    <div className="text-danger fw-bold fs-7">
      {errors.map((error, index) => <li key={index}>{error}</li>)}
    </div>
  )
}
