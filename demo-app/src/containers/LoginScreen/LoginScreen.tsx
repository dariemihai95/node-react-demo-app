import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IJwtAuthenticationResponse } from '../../openapi';
import { postLogin } from '../../services/axiosService';

const LoginScreen = ({setJwtToken}: {setJwtToken: (payload: string) => void}) => {
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
    <div>
      <label>Login Page</label>
      <form
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