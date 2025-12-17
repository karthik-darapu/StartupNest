import React, { useEffect, useState } from 'react';

const AuthExpiredModal = ({ onConfirm }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener('auth:expired', handler);
    return () => window.removeEventListener('auth:expired', handler);
  }, []);

  const handleOk = () => {
    setVisible(false);
    try {
      localStorage.removeItem('token');
    } catch (e) {
      console.log(e);

    }
     window.location.href = '/login';
  };

  if (!visible) return null;

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content text-center p-4">
          <p className="fs-6 mb-3">Your session has expired. Please login again.</p>
          <button className="btn btn-sm btn-primary btn-auto-width" onClick={handleOk}>OK</button>
        </div>
      </div>

    </div>
  );
};

export default AuthExpiredModal;
