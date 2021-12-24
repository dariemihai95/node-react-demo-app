import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { postLogin, postRegister } from '../../services/axiosService';
import themes from '../utils/themes';

class RegisterScreen extends Component {

  state = { username: '', password: '' };

  handleChange = (event: any) => {
    this.setState({ ...this.state, [event.target.name]: event.target.value });
  }

  handleSubmit = async (event: any) => {
    event.preventDefault();
    // alert('A name was submitted: ' + this.state);
    // app.get('/', function(req, res, next) {
    //   // Handle the get for this route
    // });
    const registerData = await postRegister();
    console.warn(registerData);
  }

  render() {
    return (
      <div>
        <label>Register Page</label>
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
            <input type="submit" value="Register" />
          </li>
        </form>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export default RegisterScreen;