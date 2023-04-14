import React, { useEffect } from 'react';
import './css/Modal.css';

const Modal = (props) => {
  // const closeOnEscapeKeyDown = useCallback((e) => {
  //   if((e.charCode || e.keyCode) === 27) {
  //     props.onClose();
  //   }
  // }, [props]);

  const closeOnEscapeKeyDown = (e) => {
    if((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  }

  useEffect(() => {
    document.body.addEventListener('keydown', closeOnEscapeKeyDown);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKeyDown);
    }
  });

  return (
    <div className={`modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{props.title}</h2>
        </div>
        <div className="modal-body">
          {props.children}
        </div>
        <div className="modal-footer">
          <button onClick={props.onClose}>Fechar</button>
        </div>
      </div>
    </div>
  )
}
export default Modal