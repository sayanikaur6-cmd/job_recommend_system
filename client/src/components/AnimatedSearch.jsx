import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchJobs } from "../api/jobSearchApi";

export default function AnimatedSearch() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const results = await searchJobs(query);

      navigate("/search-results", {
        state: {
          jobs: results,
          query: query,
        },
      });
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center position-relative">
      <input
        type="text"
        placeholder="Search jobs..."
        className="form-control"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
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

      {loading ? (
        <div
          className="spinner-border spinner-border-sm text-primary"
          role="status"
        ></div>
      ) : (
        <i
          className="bi bi-search"
          style={{
            fontSize: "20px",
            cursor: "pointer",
            transform: showSearch ? "rotate(90deg) scale(1.2)" : "none",
            transition: "all 0.4s ease",
          }}
          onClick={async () => {
            if (showSearch) {
              await handleSearch();
            }
            setShowSearch(!showSearch);
          }}
        ></i>
      )}
    </div>
  );
}