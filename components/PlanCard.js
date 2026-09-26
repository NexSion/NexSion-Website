export default function PlanCard({
  name,
  price,
  suffix,
  note,
  features,
  featured,
  badge,
  ctaLabel,
  ctaDisabled,
  onCta,
}) {
  return (
    <div className={"plan-card" + (featured ? " featured" : "")}>
      {badge && <span className="plan-badge">{badge}</span>}
      <h3>{name}</h3>
      <div className="plan-price">
        {price}
        {suffix && <span> {suffix}</span>}
      </div>
      {note && <p className="plan-note">{note}</p>}
      <ul className="plan-list">
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <button
        className={"btn btn-block " + (featured ? "btn-primary" : "btn-secondary")}
        onClick={onCta}
        disabled={ctaDisabled}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
