import { useState } from 'react';
import { Link } from 'react-router-dom';
import { postRegister } from '../../services/axiosService';
import { useNavigate } from "react-router-dom";

const RegisterScreen = () => {
  let navigate = useNavigate();

  const [accountData, setAccountData] = useState({ username: '', password: '' });
  const [registerError, setRegisterError] = useState('');

  const handleChange = (event: any) => {
    setAccountData({ ...accountData, [event.target.name]: event.target.value });
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const { username, password } = accountData;
    const registerData: { username: string } | string = await postRegister({ username: username, password: password });
    if (typeof registerData !== 'string' && registerData?.username) {
      setAccountData({ username: '', password: '' });
      setRegisterError('');
      navigate("/login", { replace: true });
    } else {
      setRegisterError(registerData as string || '');
    }
  }
  return (
    <div>
      <label>Register Page</label>
      <form
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20 }}
        onSubmit={handleSubmit}
      >
        <li>
          <label>
            Username:
            <input
              type="text"
              name="username"
              onChange={handleChange}
              value={accountData.username}
            />
          </label>
        </li>
        <li>
          <label>
            Password:
            <input
              type="text"
              name="password"
              onChange={handleChange}
              value={accountData.password}
            />
          </label>
        </li>
        <label style={{color: 'red'}}>{registerError}</label>
        <li>
          <input type="submit" value="Register" />
        </li>
      </form>
      <Link to="/login">Login</Link>
    </div>
  );
}

export default RegisterScreen;