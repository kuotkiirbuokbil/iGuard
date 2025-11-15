import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DataSource {
  id: string;
  url: string;
  pricePerRequest: string;
  rateLimit?: number;
  createdAt: string;
}

interface DataSourcesTableProps {
  dataSources: DataSource[];
}

export default function DataSourcesTable({ dataSources }: DataSourcesTableProps) {
  if (dataSources.length === 0) {
    return (
      <Card data-testid="card-data-sources">
        <CardHeader>
          <CardTitle className="text-lg">Your Data Sources</CardTitle>
          <CardDescription>Manage your connected data sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No data sources yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add your first data source to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-data-sources">
      <CardHeader>
        <CardTitle className="text-lg">Your Data Sources</CardTitle>
        <CardDescription>Manage your connected data sources</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm font-medium uppercase tracking-wide">URL</TableHead>
              <TableHead className="text-sm font-medium uppercase tracking-wide">Price</TableHead>
              <TableHead className="text-sm font-medium uppercase tracking-wide">Rate Limit</TableHead>
              <TableHead className="text-sm font-medium uppercase tracking-wide">Created</TableHead>
              <TableHead className="text-right text-sm font-medium uppercase tracking-wide">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataSources.map((source) => (
              <TableRow key={source.id} data-testid={`row-data-source-${source.id}`}>
                <TableCell className="font-mono text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="truncate max-w-xs">{source.url}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{source.pricePerRequest} USDC</TableCell>
                <TableCell>
                  {source.rateLimit ? (
                    <Badge variant="secondary">{source.rateLimit}/hr</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(source.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" data-testid={`button-actions-${source.id}`}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
