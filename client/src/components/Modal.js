import React, { useEffect } from 'react';
import './css/Modal.css';
import exitIcon from '../components/img/exit-icon.png';

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
    <div
      className={`modal ${props.show ? 'show' : ''}`}
      onClick={props.onClose}
    >
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {props.title}
          </h2>
        </div>
        <div className="modal-body">
          {props.children}
        </div>
        <div className="modal-footer">
          <button onClick={props.onClose}>
            <h3>
              Sair do jogo
            </h3>
            <img src={exitIcon} alt='Imagem com ícone indicando saída'/>
          </button>
        </div>
      </div>
    </div>
  )
}
export default Modal;
