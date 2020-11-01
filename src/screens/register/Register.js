import React, { Fragment, useState } from "react";
import { register } from "../../services/AuthService";
import IconGoogle from '../../assets/googleIcon.svg'
import RegisterImg from '../../assets/register.jpg'

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerErrorMsg, setRegisterErrorMsg] = useState("");

  const registerTime = Date.now()

  const registerError = async () => {
    try {
      await register(email, password, name, registerTime);
    } catch (e) {
      setRegisterErrorMsg(e.code);
    }
  };

  return (
    <Fragment>
      <main className="wrapper login">
        <div className="login__container">
          <h1 className="section__title login__title">
            Create an account
        </h1>
          <form
            className="login__form"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="">
              {/* <input
                className="form__input login__input"
                value={name}
                type="text"
                onChange={event => setName(event.target.value)}
                placeholder="Imię"
              /> */}
              <div className="">
                <input
                  className="form__input login__input"
                  value={email}
                  type="text"
                  onChange={event => setEmail(event.target.value)}
                  placeholder="E-mail"
                />
              </div>
              <div className="">
                <input
                  className="form__input login__input"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  placeholder="Hasło"
                  type="password"
                />
              </div>
              <button
                className="login__input login__submit cta"
                onClick={() => registerError()}
                type="submit"
              >
                Sign up
            </button>
              <button
                className="login__input login--submit login__google cta"
                onClick={() => registerError()}
                type="submit"
              >
                <img src={IconGoogle} alt="" />&nbsp;Sign up with Google
            </button>
            </div>
          </form>
        </div>
        <div className="login__container login__bg">
          {/* <img src={RegisterImg} alt="" className="login__bg"/> */}
        </div>
      </main>
      {registerErrorMsg && (
        <div className="form__error">Podaj poprawny E-mail oraz Hasło</div>
      )}
    </Fragment>
  );
};

export default Register;
