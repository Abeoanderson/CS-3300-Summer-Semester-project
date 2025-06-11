const Header = () => (
  <nav className="navbar bg-info-subtle border">
    <div className="container-fluid">
      <a className="navbar-brand" href="#">
        Calo-Tracker
      </a>
      <div className="login-links">
        <a href="/login" className="link">
          Login
        </a>
        <b> </b>
        <a href="/signup" className="link">
          Signup
        </a>
      </div>
    </div>
  </nav>
);

export default Header;
