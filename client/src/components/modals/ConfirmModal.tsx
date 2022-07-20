import { useModalStore } from "../../store"

export const ConfirmModal: React.FC = () => {

  const { confirmProps } = useModalStore()

  return (
    <>
      <button aria-label="toggle modal" id="app-confirm-modal-toggle-btn" type="button" className="btn d-none" data-bs-toggle="modal" data-bs-target="#app-confirm-modal" />

      <div id="app-confirm-modal" style={{ zIndex: '5000' }} className="modal fade" data-bs-keyboard="false" tabIndex={-1} data-bs-backdrop="static" aria-hidden={true}>

        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className={`bg-${confirmProps?.context} border-${confirmProps?.context} pt-1`} />
            <div className={`modal-body alert rounded-0 bg-white ${confirmProps?.context}Light text-${confirmProps?.context} m-0`}>

              <div className="d-flex align-items-start mb-4">

                <div className="w-100">{confirmProps?.message}</div>

                <button type="button"
                  name="Close"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />

              </div>

              <div className="d-flex justify-content-end">

                <button type="button"
                  name={confirmProps?.cancelText ?? 'No'}
                  className={`ms-2 btn btn-sm btn-muted`}
                  data-bs-dismiss="modal"
                  onClick={() => confirmProps?.onCancel!()}
                >
                  {confirmProps?.cancelText ?? 'No'}
                </button>

                <button type="button"
                  name={confirmProps?.confirmText ?? 'Confirm'}
                  id="__confirm_modal_confirm_btn"
                  className={`ms-2 btn btn-sm btn-${confirmProps?.context}`}
                  data-bs-dismiss="modal"
                  onClick={() => confirmProps?.onConfirm!()}
                >
                  {confirmProps?.confirmText ?? 'Confirm'}
                </button>

              </div>

            </div>

          </div>
        </div>

      </div>

    </>
  )



}
