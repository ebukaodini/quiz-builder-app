import { useModalStore } from "../../store"

export const ToastWrapper: React.FC = () => {

  const { toastList } = useModalStore()

  return (
    <>
      <div className="sticky-top" style={{ zIndex: '9999' }}>

        <div className={`toast-container position-absolute top-0 end-0 ${toastList.length > 0 && 'p-3 vh-100 overflow-hidden'}`}>

          {
            toastList.length > 0 &&
            toastList.map(toast => (

              <div key={toast.id} className={`toast show align-items-center rounded-0 border-top-0 border-end-0 shadow-sm`} role="alert" aria-live="assertive" aria-atomic="true">
                <div className={`bg-${toast.color} border-${toast.color} pt-1`} />
                <div className={`d-flex align-items-start bg-white ${toast.color}Light text-${toast.color}`}>
                  <div className="toast-body w-100">
                    <div className="fs-8">{toast.message}</div>
                  </div>
                  <button type="button" className="btn-close m-2 fs-9" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
              </div>

            ))
          }

        </div>

      </div>
    </>
  )

}