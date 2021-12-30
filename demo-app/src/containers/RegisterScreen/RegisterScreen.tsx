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
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginTop: 100 }}>
      <label style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 30 }}>Register</label>
      <form
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        onSubmit={handleSubmit}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', borderBottom: '1px solid #BBBBBB', width: 250, marginTop: 10 }}>
          <p style={{ height: 20, margin: 0, fontSize: '12px', fontWeight: '500' }}>Username</p>
          <input
            style={{ height: 20, borderWidth: 0, outline: 'none' }}
            type="text"
            name="username"
            placeholder='Type your username'
            onChange={handleChange}
            value={accountData.username}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', borderBottom: '1px solid #BBBBBB', width: 250, marginTop: 10 }}>
          <p style={{ height: 20, margin: 0, fontSize: '12px', fontWeight: '500' }}>Password</p>
          <input
            style={{ height: 20, borderWidth: 0, outline: 'none' }}
            type="text"
            name="password"
            placeholder='Type your password'
            onChange={handleChange}
            value={accountData.password}
          />
        </div>
        <div>
          <p style={{ color: 'red', marginTop: 10, fontSize: 12 }}>{registerError}</p>
          <br />
          <input type="submit" value="REGISTER" style={{ color: 'white', marginTop: 30, width: 200, height: 30, borderRadius: 20, borderWidth: 0, backgroundImage: 'linear-gradient(to right, #41B3A3 , #E8A87C)', cursor: 'pointer' }} />
        </div>
      </form>
      <p style={{ color: '#444', display: 'flex', flexDirection: 'column', marginTop: 40 }}>Already have an account ? {<Link style={{ textDecoration: 'none', cursor: 'pointer', color: 'black', margin: 10 }} to="/login">LOGIN</Link>}</p>
    </div>
  );
}

export default RegisterScreen;