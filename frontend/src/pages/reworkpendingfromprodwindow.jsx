// src\pages\reworkpendingfromprodwindow.jsx
import React from 'react';
import ReworkPendingFromProdReport from '../components/ReworkPendingFromProdReport';



export default function ReworkPendingFromProdWindow() {
  const params = new URLSearchParams(window.location.search);
  const uid = params.get('uid') || '';
  
  // ✅ Read date parameters
  const includeDateInReport = params.get('includeDateInReport') === 'true';
  const userSelectedFromDate = params.get('userSelectedFromDate') || '';
  const userSelectedToDate = params.get('userSelectedToDate') || '';
  const userSelectedFromTime = params.get('userSelectedFromTime') || '00:00:00';
  const userSelectedToTime = params.get('userSelectedToTime') || '23:59:59';

  return (
    <div style={{ padding: 12, background: '#FAFAF5', minHeight: '100vh' }}>
      <ReworkPendingFromProdReport 
        embedded   
        uidFromParent={uid} 
        // ✅ Pass date parameters
        includeDateInReport={includeDateInReport}
        userSelectedFromDate={userSelectedFromDate}
        userSelectedToDate={userSelectedToDate}
        userSelectedFromTime={userSelectedFromTime}
        userSelectedToTime={userSelectedToTime}
      />
    </div>
  );
}


