import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import "./SubmitIdea.css";
import StaticMessages from "../Constants/StaticMessages"; 

const SubmitIdea = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const profileId = location.state?.profileId;

  const [formData, setFormData] = useState({
    marketPotential: "",
    launchYear: "",
    fundingRequired: "",
    address: "",
    pitchDeckFile: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [limitModal, setLimitModal] = useState({ open: false, message: "" });

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      toast.error(StaticMessages.ERROR_PDF_FILE); 
      setErrors((prev) => ({
        ...prev,
        pitchDeckFile: StaticMessages.ERROR_PDF_FILE,
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      setFormData((prev) => ({ ...prev, pitchDeckFile: base64String }));
      toast.success("PDF uploaded successfully!"); 
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.marketPotential)
      newErrors.marketPotential = StaticMessages.ERROR_MARKET_POTENTIAL_REQUIRED;

    if (!formData.launchYear)
      newErrors.launchYear = StaticMessages.ERROR_LAUNCH_YEAR_REQUIRED;

    if (!formData.fundingRequired) {
      newErrors.fundingRequired = StaticMessages.ERROR_FUNDING_REQUIRED;
    } else if (isNaN(Number(formData.fundingRequired))) {
      newErrors.fundingRequired = StaticMessages.ERROR_FUNDING_NUMBER;
    } else if (Number(formData.fundingRequired) <= 0) {
      newErrors.fundingRequired = StaticMessages.ERROR_FUNDING_MINIMUM;
    }

    if (!formData.address.trim())
      newErrors.address = StaticMessages.ERROR_ADDRESS_REQUIRED;

    if (!formData.pitchDeckFile)
      newErrors.pitchDeckFile = StaticMessages.ERROR_PITCH_DECK_REQUIRED;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error("Please fix the errors above!");
      return;
    }

    if (!profileId) {
      toast.error(StaticMessages.ERROR_PROFILE_MISSING);
      return;
    }

    setLoading(true);
    
    try {
      const loadingToast = toast.loading("Submitting your idea...");

      const { data: profileData } = await axiosInstance.get(
        `/startupProfile/getStartupProfileById/${profileId}`
      );

      const fundingLimit = profileData?.data?.fundingLimit;
      const requestedFunding = Number(formData.fundingRequired);

      if (fundingLimit && requestedFunding > fundingLimit) {
        setLimitModal({
          open: true,
          message: `Requested funding (₹${requestedFunding.toLocaleString()}) exceeds the mentor's funding limit (₹${fundingLimit.toLocaleString()}). Please adjust your funding amount.`,
        });
        toast.dismiss(loadingToast); 
        setLoading(false);
        return;
      }

      const payload = {
        marketPotential: formData.marketPotential,
        launchYear: formData.launchYear,
        expectedFunding: Number(formData.fundingRequired),
        submissionDate: new Date().toISOString(),
        address: formData.address,
        startupProfileId: profileId,
        pitchDeckFile: formData.pitchDeckFile,
      };

      localStorage.setItem("justSubmittedProfileId", profileId);
      await axiosInstance.post("/startupSubmission/addStartupSubmission", payload);

      toast.dismiss(loadingToast); 
      toast.success(StaticMessages.SUCCESS_SUBMISSION, {
        position: "top-right",
        autoClose: 3000,
      });

      setFormData({
        marketPotential: "",
        launchYear: "",
        fundingRequired: "",
        address: "",
        pitchDeckFile: null,
      });
      setErrors({});

      setTimeout(() => {
        navigate("/entrepreneur/my-submissions");
      }, 2000);

    } catch (error) {
      toast.dismiss(); 
      toast.error(
        error.response?.data?.message || StaticMessages.ERROR_SUBMISSION_FAILED,
        { position: "top-right", autoClose: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-idea-wrapper">
      <div className="submit-idea-container shadow-sm">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2 className="form-title text-center mb-4">Submit Your Startup Idea</h2>

        <form onSubmit={handleSubmit} className="idea-form">
          <div className="mb-3">
            <label>Market Potential Score *</label>
            <input
              type="number"
              name="marketPotential"
              className={`form-control ${errors.marketPotential ? "is-invalid" : ""}`}
              value={formData.marketPotential}
              onChange={handleChange}
              min="0"
              max="100"
            />
            {errors.marketPotential && (
              <div className="invalid-feedback">{errors.marketPotential}</div>
            )}
          </div>

          <div className="mb-3">
            <label>Launch Year *</label>
            <input
              type="date"
              name="launchYear"
              className={`form-control ${errors.launchYear ? "is-invalid" : ""}`}
              value={formData.launchYear}
              onChange={handleChange}
            />
            {errors.launchYear && (
              <div className="invalid-feedback">{errors.launchYear}</div>
            )}
          </div>

          <div className="mb-3">
            <label>Funding Required (₹) *</label>
            <input
              type="number"
              name="fundingRequired"
              placeholder="Enter funding amount"
              className={`form-control ${errors.fundingRequired ? "is-invalid" : ""}`}
              value={formData.fundingRequired}
              onChange={handleChange}
              min="1"
            />
            {errors.fundingRequired && (
              <div className="invalid-feedback">{errors.fundingRequired}</div>
            )}
          </div>

          <div className="mb-3">
            <label>Address *</label>
            <textarea 
              name="address"
              placeholder="Enter your complete address"
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
            {errors.address && (
              <div className="invalid-feedback">{errors.address}</div>
            )}
          </div>

          {/* File */}
          <div className="mb-3">
            <label>Pitch Deck File (PDF) *</label>
            <input
              type="file"
              accept="application/pdf"
              className={`form-control ${errors.pitchDeckFile ? "is-invalid" : ""}`}
              onChange={handleFileChange}
            />
            {formData.pitchDeckFile && (
              <small className="text-success">✓ PDF selected</small>
            )}
            {errors.pitchDeckFile && (
              <div className="invalid-feedback d-block">{errors.pitchDeckFile}</div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Submitting...
              </>
            ) : (
              "Submit Idea"
            )}
          </button>
        </form>
      </div>

      {limitModal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{limitModal.message}</p>
            <button
              className="ok-button"
              onClick={() => setLimitModal({ open: false, message: "" })}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitIdea;