import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface AccessLog {
  id: string;
  agentId: string;
  dataSourceId: string;
  path?: string;
  status: string;
  amount?: string;
  timestamp: string;
}

interface AccessLogsTableProps {
  logs: AccessLog[];
}

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
  if (status === "success") return "default";
  if (status === "pending") return "secondary";
  return "destructive";
};

export default function AccessLogsTable({ logs }: AccessLogsTableProps) {
  if (logs.length === 0) {
    return (
      <Card data-testid="card-access-logs">
        <CardHeader>
          <CardTitle className="text-lg">Recent Access Logs</CardTitle>
          <CardDescription>Monitor agent requests to your data sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No access logs yet</p>
            <p className="text-sm text-muted-foreground mt-1">Logs will appear when agents access your data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-access-logs">
      <CardHeader>
        <CardTitle className="text-lg">Recent Access Logs</CardTitle>
        <CardDescription>Monitor agent requests to your data sources</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm font-medium uppercase tracking-wide">Timestamp</TableHead>
              <TableHead className="text-sm font-medium uppercase tracking-wide">Agent</TableHead>
              <TableHead className="text-sm font-medium uppercase tracking-wide">Path</TableHead>
              <TableHead className="text-sm font-medium uppercase tracking-wide">Status</TableHead>
              <TableHead className="text-right text-sm font-medium uppercase tracking-wide">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} data-testid={`row-access-log-${log.id}`}>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {log.agentId.substring(0, 8)}...
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {log.path || '—'}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(log.status)} className="capitalize">
                    {log.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold" data-testid={`text-amount-${log.id}`}>
                  {log.amount ? `${log.amount} USDC` : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
