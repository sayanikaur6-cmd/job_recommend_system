import { useState } from "react";

export default function AnimatedSearch({ onSearch }) {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="d-flex align-items-center">
      <input
        type="text"
        placeholder="Search jobs..."
        className="form-control"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: showSearch ? "220px" : "0px",
          opacity: showSearch ? 1 : 0,
          padding: showSearch ? "6px 12px" : "0px",
          marginRight: showSearch ? "10px" : "0px",
          transition: "all 0.4s ease",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      />

      <i
        className="bi bi-search"
        style={{
          fontSize: "20px",
          cursor: "pointer",
          transform: showSearch ? "rotate(90deg) scale(1.2)" : "none",
          transition: "all 0.4s ease",
        }}
        onClick={() => {
          if (showSearch) {
            handleSearch();
          }
          setShowSearch(!showSearch);
        }}
      ></i>
    </div>
  );
}