'use client';

import { useEffect, useState } from 'react';

const PW_KEY = 'pioneer-admin-pw';

export default function AdminApplicants() {
  const [pw, setPw] = useState('');
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function load(password) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/event-applicants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pw: password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setAuthed(false);
        sessionStorage.removeItem(PW_KEY);
        setError(res.status === 401 ? '비밀번호가 틀렸습니다.' : data.error || '불러오기에 실패했습니다.');
        return;
      }
      setRows(data.rows || []);
      setAuthed(true);
      sessionStorage.setItem(PW_KEY, password);
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY);
    if (saved) {
      setPw(saved);
      load(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    load(pw);
  };

  if (!authed) {
    return (
      <div className="admin-gate">
        <form className="admin-gate-form" onSubmit={handleSubmit}>
          <div className="admin-gate-title">PIONEER Admin</div>
          <input
            className="form-input"
            type="password"
            placeholder="관리자 비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
          />
          <button className="modal-submit" type="submit" disabled={loading}>
            {loading ? '확인 중...' : '입장'}
          </button>
          {error && <p className="admin-error">{error}</p>}
        </form>
      </div>
    );
  }

  const columns = rows && rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">이벤트 신청자 ({rows.length}명)</h1>
        <button className="btn-outline" onClick={() => load(pw)} disabled={loading}>
          {loading ? '불러오는 중...' : '새로고침'}
        </button>
      </div>
      {error && <p className="admin-error">{error}</p>}
      {rows.length === 0 ? (
        <p className="admin-empty">아직 신청자가 없습니다.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows
                .slice()
                .reverse()
                .map((row, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col}>{String(row[col] ?? '')}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
