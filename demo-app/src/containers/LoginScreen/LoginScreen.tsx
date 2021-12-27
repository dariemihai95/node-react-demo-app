import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IJwtAuthenticationResponse } from '../../openapi';
import { postLogin, recreateAxiosInstance } from '../../services/axiosService';
import { removeAuthToken, setAuthToken } from '../../utils/authManager';
import { sleep } from '../../utils/validators';

const LoginScreen = () => {
  let navigate = useNavigate();

  const [accountData, setAccountData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleChange = (event: any) => {
    setAccountData({ ...accountData, [event.target.name]: event.target.value });
  }

  const handleSubmit = async (event: any) => {
    const { username, password } = accountData;
    event.preventDefault();
    const loginData: IJwtAuthenticationResponse | string = await postLogin({ username: username, password: password });
    if (typeof loginData !== 'string' && loginData?.accessToken) {
      // removeAuthToken();
      setAuthToken(loginData.accessToken);
      recreateAxiosInstance();
      setAccountData({ username: '', password: '' });
      await sleep(0.5);
      navigate('../', { replace: true });
      // console.warn('sdadfasda')
    } else {
      recreateAxiosInstance();
      setLoginError(loginData as string || '');
    }
  }
  return (
    <div>
      <label>Login Page</label>
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
        <label style={{ color: 'red' }}>{loginError}</label>
        <br />
        <input type="submit" value="Log In" />
      </form>
      <label>If you don't have an account, {<Link to="/register">register</Link>} now.</label>
    </div>
  );
}

export default LoginScreen;