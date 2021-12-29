import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IJwtAuthenticationResponse } from '../../openapi';
import { postLogin } from '../../services/axiosService';

const LoginScreen = ({ setJwtToken }: { setJwtToken: (payload: string) => void }) => {
  let navigate = useNavigate();

  const [accountData, setAccountData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleChange = (event: any) => {
    setAccountData({ ...accountData, [event.target.name]: event.target.value });
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const { username, password } = accountData;
    const loginData: IJwtAuthenticationResponse | string = await postLogin({ username: username, password: password });
    if (typeof loginData !== 'string' && loginData?.accessToken) {
      setJwtToken(loginData.accessToken);
      setAccountData({ username: '', password: '' });
      navigate('../', { replace: true });
    } else {
      setJwtToken('');
      setLoginError(loginData as string || '');
    }
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginTop: 100 }}>
      <label style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 30 }}>Login</label>
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
          <p style={{ color: 'red', marginTop: 10, fontSize: 12 }}>{loginError}</p>
          <br />
          <input type="submit" value="LOGIN" style={{
            marginTop: 30, color: 'white', width: 200, height: 30, borderRadius: 20, borderWidth: 0, backgroundImage: 'linear-gradient(to right, #41B3A3 , #E8A87C)'
          }} />
        </div>
      </form>
      <p style={{ color: '#444', display: 'flex', flexDirection: 'column', marginTop: 40 }}>If you don't have an account, {<Link style={{ textDecoration: 'none', cursor: 'pointer', color: 'black', margin: 10 }} to="/register">REGISTER</Link>}</p>
    </div>
  );
}

export default LoginScreen;