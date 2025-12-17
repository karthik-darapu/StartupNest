
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosConfig";
import { deleteMentorProfile } from "../api/mentorApi";
import { toast } from "react-toastify";
import "./ViewStartupProfiles.css";

const ROWS_PER_PAGE = 2;

const ViewStartupProfiles = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sortRef = useRef(null);
  const tableRef = useRef(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: { profiles = [], total = 0 } = {},
    isLoading,
  } = useQuery({
    queryKey: ["mentorProfiles", debouncedSearch, page],
    queryFn: async () => {
      const mentorId = localStorage.getItem("userId");
      const res = await api.get(
        `/startupProfile/getStartupProfilesByMentorId/${mentorId}?page=${page}&limit=${ROWS_PER_PAGE}&search=${debouncedSearch}`
      );
      
      const profiles = Array.isArray(res.data?.data)
        ? res.data.data
        : res.data;
      
      const total = res.data?.total || res.data?.totalCount || profiles.length;
      
      return {
        profiles,
        total,
      };
    },
    keepPreviousData: true,
  });

  const delMutation = useMutation({
    mutationFn: deleteMentorProfile,
    onSuccess: async (data) => {
      toast.success(data?.message || "Profile deleted successfully", {
        position: "top-right",
        autoClose: 2500,
      });
      setConfirmDeleteId(null);
      await queryClient.invalidateQueries({ queryKey: ["mentorProfiles"] });
    },
    onError: async (error) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete profile";
      toast.error(msg, { position: "top-right", autoClose: 2500 });
      setConfirmDeleteId(null);
      await queryClient.invalidateQueries({ queryKey: ["mentorProfiles"] });
    },
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sortRef.current &&
        !sortRef.current.contains(e.target) &&
        tableRef.current &&
        !tableRef.current.contains(e.target)
      ) {
        setSortDir(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    let list = profiles;
    if (sortDir) {
      list = [...list].sort((a, b) => {
        const A = Number(a.fundingLimit) || 0;
        const B = Number(b.fundingLimit) || 0;
        return sortDir === "asc" ? A - B : B - A;
      });
    }
    return list;
  }, [profiles, sortDir]);

  const totalPages = Math.max(1, Math.ceil(total / ROWS_PER_PAGE));
  const currentRows = filtered;

  const handleEdit = (profile) => {
    navigate(`/mentor/edit-profile/${profile._id}`, { state: { profile } });
  };

  const handleSort = (direction) => {
    if (sortDir === direction) {
      setSortDir(null);
    } else {
      setSortDir(direction);
    }
  };

  return (
    <div className="vsp-wrapper">
      <div className="vsp-card" ref={tableRef}>
        <div className="vsp-header">
          <h2>My Startup Profiles</h2>
          <input
            type="text"
            className="vsp-search"
            placeholder="Search by category, industry, or description..."
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
                <th>Category</th>
                <th>Industry</th>
                <th>
                  <div className="vsp-funding-header" ref={sortRef}>
                    <span>Funding Limit</span>
                    <div className="vsp-sort-buttons">
                      <button
                        aria-label="Sort ascending"
                        className={`sort-btn ${sortDir === "asc" ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSort("asc");
                        }}
                        type="button"
                      >
                        ▲
                      </button>
                      <button
                        aria-label="Sort descending"
                        className={`sort-btn ${sortDir === "desc" ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSort("desc");
                        }}
                        type="button"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </th>
                <th>Equity (%)</th>
                <th>Description</th>
                <th style={{ width: 130 }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="vsp-loading-cell">
                    <div className="spinner-container">
                      <div className="spinner" />
                    </div>
                  </td>
                </tr>
              ) : currentRows.length ? (
                currentRows.map((p) => (
                  <tr key={p._id}>
                    <td>{p.category}</td>
                    <td>{p.targetIndustry}</td>
                    <td>₹{Number(p.fundingLimit).toLocaleString()}</td>
                    <td>{p.avgEquityExpectation}%</td>
                    <td className="vsp-desc">{p.description}</td>
                    <td>
                      <div className="vsp-actions">
                        <button className="btn-edit" onClick={() => handleEdit(p)}>
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => setConfirmDeleteId(p._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="vsp-empty">
                    No profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && total > 0 && (
          <div className="vsp-pagination">
            <button
              type="button"
              className="pg-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span className="pg-info">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className="pg-btn"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {confirmDeleteId && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <p className="logout-text">Are you sure you want to delete?</p>
            <div className="logout-buttons">
              <button
                className="btn-yes"
                onClick={() => delMutation.mutate(confirmDeleteId)}
                disabled={delMutation.isPending}
              >
                {delMutation.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                className="btn-cancel"
                onClick={() => setConfirmDeleteId(null)}
                disabled={delMutation.isPending}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStartupProfiles;
