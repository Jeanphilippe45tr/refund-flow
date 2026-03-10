import { Badge } from '@/components/ui/badge';

export const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    pending: 'bg-warning/10 text-warning border-warning/20',
    approved: 'bg-success/10 text-success border-success/20',
    completed: 'bg-success/10 text-success border-success/20',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
    open: 'bg-primary/10 text-primary border-primary/20',
    in_progress: 'bg-warning/10 text-warning border-warning/20',
    closed: 'bg-muted text-muted-foreground border-border',
  };
  return (
    <Badge variant="outline" className={`font-medium capitalize ${variants[status] || ''}`}>
      {status.replace('_', ' ')}
    </Badge>
  );
};
