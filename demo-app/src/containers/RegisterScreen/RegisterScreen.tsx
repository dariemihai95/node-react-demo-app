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
        // style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        onSubmit={handleSubmit}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h4>Username: </h4>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            value={accountData.username}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h4>Password: </h4>
          <input
            type="text"
            name="password"
            onChange={handleChange}
            value={accountData.password}
          />
        </div>
        <div>
          <label style={{ color: 'red' }}>{registerError}</label>
          <br />
          <input type="submit" value="Register" />
        </div>
      </form>
      <label>Already have an account ? {<Link to="/login">Login</Link>}</label>
      {/* <Link to="/login">Login</Link> */}
    </div>
  );
}

export default RegisterScreen;