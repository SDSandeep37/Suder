import "./navbar.css"
const Navbar = () => {
  return (
    <nav className="navbar flex items-center justify-between">
      <div className="navbarLeft">
        <img
          className="navbarLogo"
          src="/logo.png"
          alt="Suder Logo"
        />
      </div>
        <div className="navbarRight ">
          <a href="/profile" className="navbarLink">Profile</a>
        </div>
    </nav>
  )
}

export default Navbar