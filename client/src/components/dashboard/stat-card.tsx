interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
}

export function StatCard({ title, value, icon, iconBgColor, iconColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${iconBgColor}`}>
        <span className={`material-icons ${iconColor}`}>{icon}</span>
      </div>
      <div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{title}</p>
        <p className="text-2xl font-semibold text-neutral-600 dark:text-neutral-200">
          {value}
        </p>
      </div>
    </div>
  );
}
