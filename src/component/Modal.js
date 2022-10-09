import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './style-modal.css';
import { useDispatch, useSelector } from 'react-redux';
import { transfer } from '../redux/asyncActions/transfer';
import { useNavigate } from 'react-router-dom';

function Example() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ first: '', sec: '', third: '', fourth: '', fifth: '', sixth: '' });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const dataTransfer = useSelector((state) => state.transfer.dataTransfer);
  const pinUser = useSelector((state) => state.user.pin);
  const token = useSelector((state) => state.user.token);
  const recipient = useSelector((state) => state.transfer.dataRecipient);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChangeText = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const pin = { pin: Object.values(form).join('') };
    console.log(pin.pin);
    if (pin.pin !== pinUser) {
      navigate('/status-failed');
    } else {
      console.log('wkwkwkwkwkwk', recipient);
      const data = {
        amount: dataTransfer.amount,
        recipient_id: recipient.user_id,
        notes: dataTransfer.notes,
        time: dataTransfer.time,
        type_id: 1,
        pin: pin.pin,
      };
      dispatch(transfer({ data, token }));
      navigate('/status-success');
    }
  };

  return (
    <>
      <Button as="button" className="modal-fw9" variant="primary" onClick={handleShow}>
        Continue
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Input PIN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center fw9-input my-5">
            <div className="square">
              <input type="text" className="rounded-3 text-center fs-1" maxLength={1} name="first" onChange={handleChangeText} />
            </div>
            <div className="square">
              <input type="text" className="rounded-3 text-center fs-1" maxLength={1} name="sec" onChange={handleChangeText} />
            </div>
            <div className="square">
              <input type="text" className="rounded-3 text-center fs-1" maxLength={1} name="third" onChange={handleChangeText} />
            </div>
            <div className="square">
              <input type="text" className="rounded-3 text-center fs-1" maxLength={1} name="fourth" onChange={handleChangeText} />
            </div>
            <div className="square">
              <input type="text" className="rounded-3 text-center fs-1" maxLength={1} name="fifth" onChange={handleChangeText} />
            </div>
            <div className="square">
              <input type="text" className="rounded-3 text-center fs-1" maxLength={1} name="sixth" onChange={handleChangeText} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
          <button onClick={handleSubmit} className="modal-fw9 rounded text-light d-flex justify-content-center align-items-center" to="/status-success" variant="primary">
            Continue
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Example;
