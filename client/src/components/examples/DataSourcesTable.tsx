import DataSourcesTable from '../DataSourcesTable';

export default function DataSourcesTableExample() {
  const mockDataSources = [
    {
      id: '1',
      url: 'https://api.example.com/premium-data',
      pricePerRequest: '0.05',
      rateLimit: 100,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: '2',
      url: 'https://api.myservice.io/analytics',
      pricePerRequest: '0.10',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ];

  return (
    <div className="max-w-5xl p-6">
      <DataSourcesTable dataSources={mockDataSources} />
    </div>
  );
}
