import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosConfig";
import InputField from "../Components/ReusableComponents/InputField";
import ButtonComponent from "../Components/ReusableComponents/ButtonComponent";
import { updateMentorProfile } from "../api/mentorApi";
import { toast } from "react-toastify";
import StaticMessages from "../Constants/StaticMessages"; 
import "./StartupProfileForm.css";

const StartupProfileForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(location.state?.profile);

  const [formData, setFormData] = useState({
    category: "",
    description: "",
    fundingLimit: "",
    avgEquity: "",
    targetIndustry: "",
    preferredStage: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && location.state?.profile) {
      const p = location.state.profile;
      setFormData({
        category: p.category || "",
        description: p.description || "",
        fundingLimit: p.fundingLimit || "",
        avgEquity: p.avgEquityExpectation || "",
        targetIndustry: p.targetIndustry || "",
        preferredStage: p.preferredStage || "",
      });
    }
  }, [isEditMode, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.category)
      newErrors.category = StaticMessages.ERROR_CATEGORY_REQUIRED;

    if (!formData.description.trim()) {
      newErrors.description = StaticMessages.ERROR_DESCRIPTION_REQUIRED;
    } else if (formData.description.trim().length < 10) {
      newErrors.description = StaticMessages.ERROR_DESCRIPTION_LENGTH;
    }

    if (!formData.fundingLimit)
      newErrors.fundingLimit = StaticMessages.ERROR_FUNDING_LIMIT_REQUIRED;

    if (!formData.avgEquity)
      newErrors.avgEquity = StaticMessages.ERROR_AVG_EQUITY_REQUIRED;

    if (!formData.targetIndustry)
      newErrors.targetIndustry = StaticMessages.ERROR_INDUSTRY_REQUIRED;

    if (!formData.preferredStage)
      newErrors.preferredStage = StaticMessages.ERROR_STAGE_REQUIRED;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEditMode) {
        await updateMentorProfile({
          id: location.state.profile._id,
          updatedData: formData,
        });

        toast.success(StaticMessages.SUCCESS_PROFILE_UPDATED, {
          position: "top-right",
          autoClose: 1500,
        });
      } else {
        await api.post("/startupProfile/addStartupProfile", formData);
        toast.success(StaticMessages.SUCCESS_PROFILE_ADDED, {
          position: "top-right",
          autoClose: 1500,
        });
      }

      setFormData({
        category: "",
        description: "",
        fundingLimit: "",
        avgEquity: "",
        targetIndustry: "",
        preferredStage: "",
      });

      queryClient.invalidateQueries({ queryKey: ["mentorProfiles"] });
      setTimeout(() => navigate("/mentor/view-profiles"), 1200);
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || StaticMessages.ERROR_UNEXPECTED;
      toast.error(backendMessage, {
        position: "top-right",
        autoClose: 2500,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/mentor/view-profiles");
  };

  return (
    <div className="add-profile-wrapper">
      <div className="add-profile-container shadow-sm">
        {isEditMode && (
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
        )}

        <h2 className="form-title text-center mb-4">
          {isEditMode ? "Edit Startup Profile" : "Create New Startup Profile"}
        </h2>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="mb-3">
            <label className="form-label ">Category *</label>
            <select
              className={`form-select ${errors.category ? "is-invalid" : ""}`}
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="GreenTech">GreenTech</option>
            </select>
            {errors.category && (
              <div className="invalid-feedback">{errors.category}</div>
            )}
          </div>

          <InputField
            label="Description *"
            name="description"
            type="text"
            placeholder="Enter a short description (min 10 characters)"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
          />

          <InputField
            label="Funding Limit *"
            name="fundingLimit"
            type="number"
            placeholder="Funding Limit"
            value={formData.fundingLimit}
            onChange={handleChange}
            error={errors.fundingLimit}
          />

          <InputField
            label="Avg Equity % *"
            name="avgEquity"
            type="number"
            placeholder="Equity %"
            value={formData.avgEquity}
            onChange={handleChange}
            error={errors.avgEquity}
          />

          <div className="mb-3">
            <label className="form-label ">Target Industry *</label>
            <select
              className={`form-select ${errors.targetIndustry ? "is-invalid" : ""}`}
              name="targetIndustry"
              value={formData.targetIndustry}
              onChange={handleChange}
            >
              <option value="">Select Industry</option>
              <option value="AI">AI</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Energy">Energy</option>
              <option value="GreenTech">GreenTech</option>
            </select>
            {errors.targetIndustry && (
              <div className="invalid-feedback">{errors.targetIndustry}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label ">Preferred Stage *</label>
            <select
              className={`form-select ${errors.preferredStage ? "is-invalid" : ""}`}
              name="preferredStage"
              value={formData.preferredStage}
              onChange={handleChange}
            >
              <option value="">Select Stage</option>
              <option value="idea">Idea</option>
              <option value="MVP">MVP</option>
              <option value="pre-revenue">Pre-revenue</option>
              <option value="scaling">Scaling</option>
              <option value="established">Established</option>
            </select>
            {errors.preferredStage && (
              <div className="invalid-feedback">{errors.preferredStage}</div>
            )}
          </div>

          <div className="button-container">
            <ButtonComponent
              type="submit"
              text={
                loading
                  ? isEditMode
                    ? "Updating..."
                    : "Adding..."
                  : isEditMode
                    ? "Update Profile"
                    : "Add Profile"
              }
              disabled={loading}
            />
          </div>
        </form>
      </div>

      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}

    </div>
  );
};

export default StartupProfileForm;
