import {
  LayoutDashboard,
  Wallet,
  Newspaper,
  BarChart3,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div>

        <div className="logo">
          <div className="logo-icon">
            F
          </div>

          <span>FinAI</span>
        </div>

        <nav className="nav-menu">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-item ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              `nav-item ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >
            <Wallet size={20} />
            Portfolio
          </NavLink>

          <NavLink
            to="/news"
            className={({ isActive }) =>
              `nav-item ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >
            <Newspaper size={20} />
            News
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `nav-item ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >
            <BarChart3 size={20} />
            Analytics
          </NavLink>

        </nav>
      </div>

      

    </aside>
  );
}

export default Sidebar;