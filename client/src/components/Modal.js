import React, { useEffect } from 'react';
import './css/Modal.css';
import exitIcon from '../img/exit-icon.png';

const Modal = (props) => {
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
        {props.title}
        <button onClick={props.onClose}><img src={exitIcon}/></button>
        </div>
        <div className="modal-body">
          {props.children}
        </div>
      </div>
    </div>
  )
}
export default Modal