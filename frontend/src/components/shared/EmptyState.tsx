interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon = 'inbox', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#e5eeff] flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px] text-[#004ac6]">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-[#0b1c30] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#434655] max-w-md">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
