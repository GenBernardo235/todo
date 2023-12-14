import './navbar.css';

import { Theme } from '../';
import { FaStickyNote } from 'react-icons/fa';

export default function Navbar({ user, logout }) {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <FaStickyNote size={30} />
        <h1>Linote</h1>
      </div>
      <div className="nav-links">
        <p onClick={logout}>{user.email}</p>
        <Theme />
      </div>
    </nav>
  );
}
