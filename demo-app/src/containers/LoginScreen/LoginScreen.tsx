import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IJwtAuthenticationResponse } from '../../openapi';
import { postLogin } from '../../services/axiosService';
import { setAuthToken } from '../../utils/authManager';
import themes from '../../utils/themes';

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
      setAuthToken(loginData.accessToken)
      setAccountData({ username: '', password: '' });
      navigate("/", { replace: true });
    } else {
      setLoginError(loginData as string || '');
    }
  }
  return (
    <div>
      <label>Login Page</label>
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
        <label style={{color: themes.colors.errorHighligh}}>{loginError}</label>
        <li>
          <input type="submit" value="Submit" />
        </li>
      </form>
      <Link to="/register">Register</Link>
      <Link to="/tasks">Tasks</Link>
    </div>
  );
}

export default LoginScreen;