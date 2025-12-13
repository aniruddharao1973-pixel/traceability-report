// src/components/FilterBar.jsx
import React from 'react';
import './filterbar.css';

export default function FilterBar({
  useDateFilter,
  setUseDateFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  fromTime,
  setFromTime,
  toTime,
  setToTime,
  pageMaxWidth,
  palette = {
    page: '#ffffff',
    mutedText: '#666',
    text: '#000000',
  },
  darkMode = false,
}) {
  // ✅ Safe fallback so palette.text won't crash
  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: `1px solid ${darkMode ? '#2b3d46' : '#cfdbe6'}`,
    background: darkMode ? '#234758ff' : '#fff',
    color: palette.text,
    fontSize: 14,
    outline: 'none',
    boxShadow: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
  };

  return (
    <div
      style={{
        maxWidth: pageMaxWidth,
        margin: '0 auto 14px',
        padding: 16,
        background: palette.page,
        borderRadius: 8,
        boxShadow: darkMode
          ? '0 1px 2px rgba(255,255,255,0.03) inset'
          : '0 1px 2px rgba(0,0,0,0.05) inset',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            color: palette.mutedText,
            fontWeight: 600,
          }}
        >
          <input
            type="checkbox"
            checked={useDateFilter}
            onChange={(e) => setUseDateFilter(e.target.checked)}
          />
          <span style={{ fontSize: 14 }}>Use Date/Time Filter</span>
        </label>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 10px',
              borderRadius: 8,
              background: darkMode ? '#1b2e36' : '#f3f7fb',
              color: palette.mutedText,
              fontSize: 13,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              style={{ opacity: 0.8 }}
            >
              <path
                d="M7 10h10M7 6h10M7 14h10"
                stroke={darkMode ? '#9fb6c6' : '#5b6b7a'}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ fontWeight: 500 }}>Quick Range</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginTop: 12,
        }}
      >
        {/* FROM DATE */}
        <div>
          <div
            style={{ fontSize: 12, color: palette.mutedText, marginBottom: 6 }}
          >
            From Date
          </div>
          <input
            className="modern-input"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* TO DATE */}
        <div>
          <div
            style={{ fontSize: 12, color: palette.mutedText, marginBottom: 6 }}
          >
            To Date
          </div>
          <input
            className="modern-input"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* FROM TIME */}
        <div>
          <div
            style={{ fontSize: 12, color: palette.mutedText, marginBottom: 6 }}
          >
            From Time
          </div>
          <input
            className="modern-input"
            type="time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            step="1"
            style={inputStyle}
          />
        </div>

        {/* TO TIME */}
        <div>
          <div
            style={{ fontSize: 12, color: palette.mutedText, marginBottom: 6 }}
          >
            To Time
          </div>
          <input
            className="modern-input"
            type="time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            step="1"
            style={inputStyle}
          />
        </div>
      </div>
    </div>
  );
}
