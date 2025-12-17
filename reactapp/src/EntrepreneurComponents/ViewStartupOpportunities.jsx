import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import "./ViewStartupOpportunities.css";

const ViewStartupOpportunities = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [originalData, setOriginalData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/startupProfile/getAllPublicStartupProfiles?page=${page}&limit=${limit}&search=${debouncedSearch}`
      );
      const profiles = res.data?.data || [];

      const submissionRes = await axiosInstance.get(
        `/startupSubmission/getSubmissionsByUserId/${localStorage.getItem("userId")}`
      );
      const submittedIds = (submissionRes.data?.data || []).map(
        (s) => s.startupProfileId?._id
      );

      const data = profiles.map((p) => ({
        ...p,
        statusLabel: submittedIds.includes(p._id)
          ? "Submitted"
          : "Available",
      }));

      setOpportunities(data);
      setOriginalData(data);
      setTotalPages(Math.ceil((res.data?.total || 1) / limit));

      const justSubmittedId = localStorage.getItem("justSubmittedProfileId");
      if (justSubmittedId) {
        setOpportunities((prev) =>
          prev.map((p) =>
            p._id === justSubmittedId ? { ...p, statusLabel: "Submitted" } : p
          )
        );
        localStorage.removeItem("justSubmittedProfileId");
      }
    } catch (error) {
      console.error("Error fetching startup opportunities:", error);
      setOpportunities([]);
      setOriginalData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [page, debouncedSearch]);

  const handleSort = (direction) => {
    if (sortOrder === direction) {
      // Unclick → reset to original order
      setSortOrder(null);
      setOpportunities([...originalData]);
      return;
    }

    // Otherwise sort
    setSortOrder(direction);
    const sorted = [...opportunities].sort((a, b) => {
      const aVal = a.fundingLimit || 0;
      const bVal = b.fundingLimit || 0;
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    });
    setOpportunities(sorted);
  };

  const handleSubmitIdea = (profile) => {
    navigate("/entrepreneur/submit-idea", {
      replace: false,
      state: {
        profileId: profile._id,
        category: profile.category,
        targetIndustry: profile.targetIndustry,
        fundingLimit: profile.fundingLimit,
        avgEquityExpectation: profile.avgEquityExpectation,
        preferredStage: profile.preferredStage,
        description: profile.description,
      },
    });
  };

  return (
    <div className="vsp-wrapper">
      <div className="vsp-card">
        <div className="vsp-header">
          <h2>Available Startup Opportunities</h2>
          <h1 style={{ display: "none" }}>Logout</h1>
          <input
            type="text"
            placeholder="Search by Category..."
            className="vsp-search"
            value={searchTerm}
            onChange={(e) => {
              setPage(1);
              setSearchTerm(e.target.value);
            }}
          />
        </div>

        <div className="vsp-table-wrapper">
          <table className="vsp-table">
            <thead>
              <tr>
                <th>SNo</th>
                <th>Category</th>
                <th>Industry</th>
                <th className="vsp-funding-header">
                  Funding Limit
                  <div className="vsp-sort-buttons">
                    <button
                      className={`sort-btn ${sortOrder === "asc" ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSort("asc");
                      }}
                      type="button"
                    >
                      ▲
                    </button>
                    <button
                      className={`sort-btn ${sortOrder === "desc" ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSort("desc");
                      }}
                      type="button"
                    >
                      ▼
                    </button>
                  </div>
                </th>

                <th>Equity (%)</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="vsp-loading-cell">
                    <div className="spinner"></div>
                  </td>
                </tr>
              ) : opportunities.length === 0 ? (
                <tr>
                  <td colSpan="6" className="vsp-empty">
                    No startup opportunities found.
                  </td>
                </tr>
              ) : (
                opportunities.map((profile, i) => (
                  <tr key={profile._id}>
                    <td>{(page - 1) * limit + i + 1}</td>
                    <td>{profile.category}</td>
                    <td>{profile.targetIndustry}</td>
                    <td>₹{profile.fundingLimit?.toLocaleString()}</td>
                    <td>{profile.avgEquityExpectation}%</td>
                    <td>
                      {profile.statusLabel === "Submitted" ? (
                        <button
                          style={{ backgroundColor: "green" }}
                          className="btn-edit"
                          disabled
                        >
                          Submitted
                        </button>
                      ) : (
                        <button
                          className="btn-edit"
                          onClick={() => handleSubmitIdea(profile)}
                        >
                          Submit Idea
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="vsp-pagination">
          <button
            className="pg-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Prev
          </button>
          <span className="pg-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="pg-btn"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewStartupOpportunities;
