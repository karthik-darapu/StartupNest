import React from 'react';
import './ReusableModal.css';

const ReusableModal = ({ open, message, onConfirm, onCancel, confirmLabel = "OK", cancelLabel = "Close" }) => {
    if (!open) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-message">{message}</div>
                <div className="modal-actions">
                    {onCancel && <button className="modal-btn" onClick={onCancel}>{cancelLabel}</button>}
                </div>
            </div>
        </div>
    );
};

export default ReusableModal;
