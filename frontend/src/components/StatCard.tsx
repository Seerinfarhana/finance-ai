interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  positive?: boolean;
}

function StatCard({
  title,
  value,
  subtitle,
  positive,
}: StatCardProps) {

  let valueClass = "";

  if (positive === true) {
    valueClass = "stat-positive";
  }

  if (positive === false) {
    valueClass = "stat-negative";
  }

  return (
    <div className="stat-card">

      <div className="stat-card-top">
        <span className="stat-title">
          {title}
        </span>

        <span className="stat-indicator" />
      </div>

      <h2 className={valueClass}>
        {value}
      </h2>

      <p>
        {subtitle}
      </p>

    </div>
  );
}

export default StatCard;