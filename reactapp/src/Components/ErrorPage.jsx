import React from 'react';

const ErrorPage = () => {

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="card shadow-sm" style={{ maxWidth: '500px', border: 'none' }}>
        <div className="card-body text-center p-5">

          <h2 className="fw-bold mb-3" style={{ color: '#842029' }}>
            Oops! Something Went Wrong
          </h2>
          <div className="mb-3">
            <img
              src="/alert.png"
              alt='Error Aler'
              className='img-fluid'
              style={{ maxWidth: '200px', height: 'auto' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
