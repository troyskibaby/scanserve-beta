import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LogActivity.css';
import { FaShieldAlt, FaTools, FaWrench } from 'react-icons/fa';

const LogActivity = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const qrCode = location.state?.qrCode || '';
  const boilerType = location.state?.boilerType || '';
  const boilerAddress = location.state?.boilerAddress || '';
  const boilerPostcode = location.state?.boilerPostcode || '';

  const handleNavigate = (path) => {
    navigate(path, {
      state: {
        qrCode,
        boilerType,
        boilerAddress,
        boilerPostcode
      }
    });
  };

  return (
    <div className="log-activity-container">
      <div className="log-activity-title">
        What activity would you like to log?
      </div>

      {boilerType === 'Gas' ? (
        <div className="log-activity-cards">
          <div
            className="log-activity-card"
            onClick={() => handleNavigate('/gas-safety-report')}
          >
            <FaShieldAlt size={32} style={{ marginBottom: '10px' }} />
            <h3>Landlord Gas Safety Record</h3>
            <div className="log-activity-description">
              Official gas safety certificate for landlords and agents.
            </div>
          </div>

          <div
            className="log-activity-card"
            onClick={() => handleNavigate('/NewRoutineService')}
          >
            <FaTools size={32} style={{ marginBottom: '10px' }} />
            <h3>Routine Service Record</h3>
            <div className="log-activity-description">
              Log a standard boiler service with checks and notes.
            </div>
          </div>

          <div
            className="log-activity-card"
            onClick={() => handleNavigate('/newMaintenanceLog')}
          >
            <FaWrench size={32} style={{ marginBottom: '10px' }} />
            <h3>General Maintenance</h3>
            <div className="log-activity-description">
              Track any general repairs or non-service boiler issues.
            </div>
          </div>
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'red' }}>
          Activity logging is only available for Gas boilers.
        </p>
      )}
    </div>
  );
};

export default LogActivity;
