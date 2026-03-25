export default function DashboardPage() {
  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner" style={{ maxWidth: 800 }}>
        <div className="section-label">Members</div>
        <h2 className="section-h2">Member Portal</h2>
        <p className="section-sub">
          The member dashboard — nutrition tracking, workout logs, and progress metrics —
          is coming soon.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <a className="btn-gold" href="/pricing">Get Access →</a>
        </div>
      </div>
    </div>
  );
}
