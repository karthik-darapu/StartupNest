import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/axiosConfig";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import StaticMessages from "../Constants/StaticMessages";

import "./ViewStartupOpportunities.css";

const MySubmissions = () => {
  const user = useSelector((state) => state.user);
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showPitchDeck, setShowPitchDeck] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Debounce search (500ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 500);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch submissions from backend
  const fetchSubmissions = useCallback(async () => {
    if (!user?.userId) return;

    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/startupSubmission/getSubmissionsByUserId/${user.userId}?page=${page}&limit=${limit}&search=${encodeURIComponent(
          debouncedSearch
        )}`
      );

      const data = res?.data?.data || [];
      const total = res?.data?.total || data.length || 1;
      setSubmissions(Array.isArray(data) ? data : []);
      setTotalPages(Math.ceil(total / limit));
    } catch (err) {
      console.error(StaticMessages.ERROR_FETCH_SUBMISSIONS, err);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [user, page, limit, debouncedSearch]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Delete submission
  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(
        `/startupSubmission/deleteStartupSubmission/${id}`
      );

      toast.success(res.data?.message || StaticMessages.SUCCESS_SUBMISSION_DELETED, {
        position: "top-right",
        autoClose: 2500,
      });

      setSubmissions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(StaticMessages.ERROR_DELETE_SUBMISSION, err);

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        StaticMessages.ERROR_DELETE_SUBMISSION_FALLBACK;

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2500,
      });

      fetchSubmissions();
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };


  // View pitch deck PDF
  const handleViewPitchDeck = async (submission) => {
    setShowPitchDeck(true);
    setIsPdfLoading(true);
    setPdfError("");
    try {
      const response = await axiosInstance.get(
        `/startupSubmission/getSubmissionFile/${submission._id}`,
        { responseType: "arraybuffer" }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error(StaticMessages.ERROR_LOAD_PITCH_DECK, error);
      setPdfError(StaticMessages.ERROR_PITCH_DECK_LOAD_FAILED);
    } finally {
      setIsPdfLoading(false);
    }
  };

  // Sort by category
  const toggleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    const sorted = [...submissions].sort((a, b) => {
      const catA = a.startupProfileId?.category || "";
      const catB = b.startupProfileId?.category || "";
      return newOrder === "asc"
        ? catA.localeCompare(catB)
        : catB.localeCompare(catA);
    });
    setSubmissions(sorted);
    setSortOrder(newOrder);
  };

  return (
    <div className="vsp-wrapper">
      <div className="vsp-card">
        <div className="vsp-header">
          <h2>My Startup Submissions</h2>
          <input
            type="text"
            placeholder="Search by Category..."
            className="vsp-search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="vsp-table-wrapper">
          <table className="vsp-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th
                  onClick={toggleSort}
                  style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  Category{" "}
                  {sortOrder === "asc"
                    ? "▲"
                    : sortOrder === "desc"
                      ? "▼"
                      : ""}
                </th>
                <th>Funding</th>
                <th>Equity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="vsp-loading-cell">
                    <div className="spinner"></div>
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="vsp-empty">
                    No submissions found.
                  </td>
                </tr>
              ) : (
                submissions.map((s, i) => (
                  <tr key={s._id}>
                    <td>{(page - 1) * limit + i + 1}</td>
                    <td>{s.startupProfileId?.category || "—"}</td>
                    <td>₹{s.expectedFunding?.toLocaleString() || "—"}</td>
                    <td>{s.startupProfileId?.avgEquityExpectation || "—"}%</td>
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
                        {s.status === 2
                          ? "Shortlisted"
                          : s.status === 3
                            ? "Rejected"
                            : "Submitted"}
                      </span>
                    </td>


                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => setSelectedProfile(s.startupProfileId)}
                      >
                        View Profile
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => handleViewPitchDeck(s)}
                      >
                        View Pitch Deck
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => {
                          setDeleteId(s._id);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </button>
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
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span className="pg-info">
            Page {page} of {totalPages || 1}
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

      {/* View Profile Modal */}
      {selectedProfile && (
        <div className="logout-overlay">
          <div
            className="logout-modal"
            style={{ width: "90%", maxWidth: "900px" }}
          >
            <h3 style={{ color: "#004c91", marginBottom: "10px" }}>
              Startup Profile
            </h3>
            <p>
              <strong>Category:</strong> {selectedProfile.category || "—"}
            </p>
            <p>
              <strong>Industry:</strong>{" "}
              {selectedProfile.targetIndustry || "—"}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {selectedProfile.description || "—"}
            </p>
            <p>
              <strong>Funding Limit:</strong> ₹
              {selectedProfile.fundingLimit?.toLocaleString() || "—"}
            </p>
            <p>
              <strong>Equity Expectation:</strong>{" "}
              {selectedProfile.avgEquityExpectation || "—"}%
            </p>
            <p>
              <strong>Preferred Stage:</strong>{" "}
              {selectedProfile.preferredStage || "—"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {selectedProfile.createdAt
                ? new Date(selectedProfile.createdAt).toLocaleString()
                : "—"}
            </p>

            <div className="logout-buttons" style={{ marginTop: "16px" }}>
              <button
                className="btn-cancel"
                onClick={() => setSelectedProfile(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showPitchDeck && (
        <div className="logout-overlay">
          <div
            className="logout-modal"
            style={{ width: "90%", maxWidth: "900px" }}
          >
            <h3 style={{ color: "#004c91", marginBottom: "10px" }}>
              Pitch Deck
            </h3>
            {isPdfLoading ? (
              <p>{StaticMessages.LOADING_PITCH_DECK}</p>
            ) : pdfError ? (
              <p style={{ color: "red" }}>{pdfError}</p>
            ) : pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="Pitch Deck"
                width="100%"
                height="600px"
                style={{
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                }}
              />
            ) : (
              <p>{StaticMessages.NO_PITCH_DECK_AVAILABLE}</p>
            )}
            <div className="logout-buttons" style={{ marginTop: "16px" }}>
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowPitchDeck(false);
                  setPdfUrl("");
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="logout-overlay">
          <div className="logout-modal" style={{ maxWidth: "400px" }}>
            <h3>Confirm Delete</h3>
            <p>{StaticMessages.MSG_CONFIRM_DELETE}</p>
            <div className="logout-buttons" style={{ marginTop: "16px" }}>
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-edit"
                onClick={() => handleDelete(deleteId)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
