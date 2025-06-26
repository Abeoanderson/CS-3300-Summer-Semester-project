import { Link } from 'react-router-dom'
const Header = () => (
  <nav className="navbar bg-info-subtle border">
    <div className="container-fluid">
      <a className="navbar-brand" href="#">
        Calo-Tracker
      </a>
      <div className="login-links">
        <Link to="/" className="link">Home</Link>
        <b> </b>
        <Link to="/login" className="Login">Login</Link>
        <b> </b>
        <Link to="/signup" className="signup">Signup</Link>
      </div>
    </div>
  </nav>
);

export default Header;
