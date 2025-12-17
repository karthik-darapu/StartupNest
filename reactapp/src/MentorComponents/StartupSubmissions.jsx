import React, { useEffect, useMemo, useState } from "react";
import {
  fetchStartupSubmissions,
  updateSubmissionStatus,
  getSubmissionFile,
} from "../api/submissionApi";
import "./StartupSubmissions.css";
import ReusableModal from "../Components/ReusableComponents/ReusableModal";

const ROWS_PER_PAGE = 2;

const StartupSubmissions = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [submissions, setSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [sortOrder, setSortOrder] = useState(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const res = await fetchStartupSubmissions({
        page,
        limit: ROWS_PER_PAGE,
        search: debouncedSearch,
        status: statusFilter,
      });
      setSubmissions(res.submissions);
      setTotal(res.total);
    } catch (err) {
      console.error("Failed to fetch submissions", err);
      setSubmissions([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [debouncedSearch, statusFilter, page]);

  const totalPages = Math.max(1, Math.ceil(total / ROWS_PER_PAGE));

  const getStatusLabel = (statusValue) => {
    switch (statusValue) {
      case 1:
        return "Submitted";
      case 2:
        return "Shortlisted";
      case 3:
        return "Rejected";
      default:
        return "—";
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateSubmissionStatus(id, status);
      fetchList();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleSort = (direction) => {
    if (sortOrder === direction) {
      setSortOrder(null);
    } else {
      setSortOrder(direction);
    }
  };

  const sortedSubmissions = useMemo(() => {
    if (!sortOrder) return submissions;

    return [...submissions].sort((a, b) => {
      const aDate = a.submissionDate ? new Date(a.submissionDate) : new Date(0);
      const bDate = b.submissionDate ? new Date(b.submissionDate) : new Date(0);
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    });
  }, [submissions, sortOrder]);

  useEffect(() => {
    if (showModal && selected?._id) {
      const fetchPdf = async () => {
        setIsPdfLoading(true);
        setPdfError("");
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);

        try {
          const response = await getSubmissionFile(selected._id);
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          setPdfUrl(fileURL);
        } catch (error) {
          console.error("Failed to fetch PDF", error);
          setPdfError("Could not load the pitch deck.");
        } finally {
          setIsPdfLoading(false);
        }
      };
      fetchPdf();
    }
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [showModal, selected]);

  return (
    <div className="submission-wrapper">
      <div className="submission-card">
        <h2 className="submission-title">Startup Submissions for Review</h2>
        <h1 style={{ display: "none" }}>Logout</h1>

        <div className="submission-controls">
          <input
            type="text"
            className="submission-search"
            placeholder="Search by Entrepreneur or Category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <div className="filter-wrapper">
            <label htmlFor="statusFilter" className="filter-label">
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              className="submission-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option>All</option>
              <option>Submitted</option>
              <option>Shortlisted</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        {/* Table with wrapper for horizontal scroll */}
        <div className="submission-table-wrapper">
          <table className="submission-table">
            <thead>
              <tr>
                <th>Entrepreneur</th>
                <th>Category</th>
                <th>Launch Year</th>

                <th className="vsp-funding-header">
                  Submission Date
                  <div className="vsp-sort-buttons">
                    <button
                      className={`sort-btn ${sortOrder === "asc" ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSort("asc");
                      }}
                      aria-label="Sort ascending"
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
                      aria-label="Sort descending"
                      type="button"
                    >
                      ▼
                    </button>
                  </div>
                </th>

                <th>Funding</th>
                <th>Market Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="vsp-loading-cell">
                    <div className="spinner" />
                  </td>
                </tr>
              ) : sortedSubmissions.length ? (
                sortedSubmissions.map((s) => (
                  <tr key={s._id}>
                    <td>{s.userId?.userName || s.userName || "—"}</td>
                    <td>{s.startupProfileId?.category || "—"}</td>
                    <td>{s.launchYear ? new Date(s.launchYear).getFullYear() : "—"}</td>
                    <td>
                      {s.submissionDate
                        ? new Date(s.submissionDate).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                    <td>₹{Number(s.expectedFunding || 0).toLocaleString()}</td>
                    <td>{s.marketPotential || "—"}</td>
                    <td>
                      <span
                        className={
                          s.status === 2
                            ? "text-green"
                            : s.status === 3
                              ? "text-red"
                              : "text-blue"
                        }
                      >
                        {getStatusLabel(s.status)}
                      </span>
                    </td>

                    <td>
                      <div className="submission-actions">
                        <button
                          className="btn-view"
                          onClick={() => {
                            setSelected(s);
                            setShowModal(true);
                          }}
                        >
                          View
                        </button>
                        {getStatusLabel(s.status) !== "Shortlisted" && (
                          <button
                            className="btn-green"
                            onClick={() => handleStatusUpdate(s._id, 2)}
                          >
                            Shortlist
                          </button>
                        )}
                        {getStatusLabel(s.status) !== "Rejected" && (
                          <button
                            className="btn-red"
                            onClick={() => handleStatusUpdate(s._id, 3)}
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-cell">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && total > 0 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <ReusableModal
        open={showModal}
        message={
          <>
            <h3>Entrepreneur Details</h3>
            <p>
              <strong>Address:</strong> {selected?.address || "N/A"}
            </p>
            <h3>Pitch Deck</h3>
            {isPdfLoading && <p>Loading Pitch Deck...</p>}
            {pdfError && <p className="error-message">{pdfError}</p>}
            {pdfUrl && !isPdfLoading && (
              <div className="pdf-panel">
                <iframe src={pdfUrl} title="Pitch Deck" />
              </div>
            )}
            {!isPdfLoading && !pdfUrl && !pdfError && <p>No pitch deck available.</p>}
          </>
        }
        onCancel={() => {
          setShowModal(false);
          setSelected(null);
          setPdfUrl("");
          setPdfError("");
        }}
      />
    </div>
  );
};

export default StartupSubmissions;