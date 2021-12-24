import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { postLogin } from '../../services/axiosService';
import themes from '../utils/themes';

class LoginScreen extends Component {

  state = { username: '', password: '' };

  handleChange = (event: any) => {
    this.setState({ ...this.state, [event.target.name]: event.target.value });
  }

  handleSubmit = async (event: any) => {
    event.preventDefault();
    // alert('A name was submitted: ' + this.state);
    const loginData = await postLogin();
    console.warn(loginData);
  }

  render() {
    return (
      <div>
        <label>Login Page</label>
        <form
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20 }}
          onSubmit={this.handleSubmit}
        >
          <li>
            <label>
              Username:
              <input
              type="text"
              name="username"
              onChange={this.handleChange}
              value={this.state.username}
              />
            </label>
          </li>
          <li>
            <label>
              Password:
              <input
              type="text"
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
              />
            </label>
          </li>
          <li>
            <input type="submit" value="Submit" />
          </li>
        </form>
        <Link to="/register">Register</Link>
      </div>
    );
  }
}

export default LoginScreen;