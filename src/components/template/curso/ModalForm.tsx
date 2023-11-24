import React from 'react';
import Modal from 'react-modal';
import CursoForm from './CursoForm';


interface ModalFormProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

Modal.setAppElement('#root');

function ModalForm({ isOpen, onRequestClose }: ModalFormProps) {
  const customStyles = {
    content: {
      backgroundColor: 'transparent', 
      borderRadius: '11px',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)', 
      width: '80%',
      height: '85%',
    },
  };

  const formStyles = {
    margin: '0px',
  };

  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Formulário Modal"
    >
      <button
        onClick={onRequestClose}
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '15px',
          cursor: 'pointer',
        }}
      >
        <svg
          className="anima1 svg-close fecharMenu"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="20"
          height="20"
        >
          <line x1="0" y1="0" x2="20" y2="20" stroke="gray" strokeWidth="2" />
          <line x1="20" y1="0" x2="0" y2="20" stroke="gray" strokeWidth="2" />
        </svg>
      </button>
      <div style={formStyles}>
        <CursoForm />
      </div>
    </Modal>
  );
}
export default ModalForm;
