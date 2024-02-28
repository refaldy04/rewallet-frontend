import React, { useEffect, useRef, useState } from "react";
import "../asset/css/create-pin.css";
import Intro from "../component/Intro";
import { useDispatch, useSelector } from "react-redux";
import { createPin } from "../redux/asyncActions/user";
import { useNavigate } from "react-router-dom";

export const CreatePin = () => {
  const [pins, setPins] = useState(["", "", "", "", "", ""]);
  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];

  const handlePinChange = (e, index) => {
    const newPin = e.target.value;
    const newPins = [...pins];
    newPins[index] = newPin;
    setPins(newPins);

    // Pindahkan fokus ke input berikutnya jika karakter telah dimasukkan
    if (newPin !== "" && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleBackspace = (index) => {
    // Menghapus karakter dan pindahkan fokus ke input sebelumnya
    const newPins = [...pins];
    newPins[index] = "";
    setPins(newPins);

    if (index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  useEffect(() => {
    // Reset fokus ke input pertama ketika semua input telah terisi
    if (pins.every((pin) => pin !== "")) {
      inputRefs[0].current.focus();
    }
  }, [pins]);

  const email = useSelector((state) => state.user.email);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formPin = {
    pin: Object.values(pins).join(""),
    email,
  };

  const onCreatePin = () => {
    dispatch(
      createPin({
        formPin,
        cb: () => navigate("/dashboard", { replace: true }),
      })
    );
  };

  return (
    <section className="row d-flex flex-column-reverse flex-md-row">
      <Intro />

      <div className="col-md-5 fw-form d-flex flex-column fw-create-pin">
        <h3 className="fw-motto fw-margin">
          Start Accessing Banking Needs With All Devices and All Platforms With
          30.000+ Users
        </h3>
        <p className="fw-accessibility mt-4">
          Transfering money is eassier than ever, you can access Zwallet
          wherever you are. Desktop, laptop, mobile phone? we cover all of that
          for you!
        </p>

        <div className="d-flex justify-content-center gap-3 my-5">
          {pins.map((pin, index) => (
            <div className="square-box">
              <input
                key={index}
                type="text"
                maxLength="1"
                value={pin}
                onChange={(e) => handlePinChange(e, index)}
                ref={inputRefs[index]}
                onKeyDown={(e) => {
                  // Handle backspace key
                  if (e.key === "Backspace") {
                    e.preventDefault();
                    handleBackspace(index);
                  }
                }}
                className="rounded-3 text-center fs-1"
              />
            </div>
          ))}
        </div>

        <div className="d-grid fw-button create rounded">
          <button
            onClick={onCreatePin}
            className="btn text-light fw-bold"
            type="button"
          >
            Confirm
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreatePin;
