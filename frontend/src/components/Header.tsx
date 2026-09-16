import {
  Search,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

function Header() {
  const navigate = useNavigate();

  const [ticker, setTicker] =
    useState("");

  function handleSearch() {
    const cleanedTicker =
      ticker.trim().toUpperCase();

    if (!cleanedTicker) {
      return;
    }

    navigate(
      `/news?ticker=${encodeURIComponent(
        cleanedTicker
      )}`
    );
  }

  return (
    <header className="header">

      <div>
        <h1>
          Financial Dashboard
        </h1>

        <p>
          Monitor your portfolio and
          AI-powered market insights
        </p>
      </div>

      <div className="header-actions">

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search ticker..."
            value={ticker}
            maxLength={10}
            onChange={(event) =>
              setTicker(
                event.target.value.toUpperCase()
              )
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>

        

        <div className="profile">
          FA
        </div>

      </div>

    </header>
  );
}

export default Header;