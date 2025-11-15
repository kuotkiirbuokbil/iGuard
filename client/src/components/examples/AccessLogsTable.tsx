import AccessLogsTable from '../AccessLogsTable';

export default function AccessLogsTableExample() {
  const mockLogs = [
    {
      id: '1',
      agentId: 'agent-abc123def456',
      dataSourceId: 'ds-1',
      path: '/api/v1/data',
      status: 'success',
      amount: '0.05',
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: '2',
      agentId: 'agent-xyz789ghi012',
      dataSourceId: 'ds-1',
      path: '/api/v1/analytics',
      status: 'success',
      amount: '0.05',
      timestamp: new Date(Date.now() - 600000).toISOString(),
    },
    {
      id: '3',
      agentId: 'agent-abc123def456',
      dataSourceId: 'ds-2',
      status: 'failed',
      timestamp: new Date(Date.now() - 900000).toISOString(),
    },
  ];

  return (
    <div className="max-w-5xl p-6">
      <AccessLogsTable logs={mockLogs} />
    </div>
  );
}
