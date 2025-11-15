interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold" data-testid="text-page-title">{title}</h1>
      {description && (
        <p className="text-muted-foreground" data-testid="text-page-description">{description}</p>
      )}
    </div>
  );
}
