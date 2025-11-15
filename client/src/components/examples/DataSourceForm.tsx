import DataSourceForm from '../DataSourceForm';

export default function DataSourceFormExample() {
  return (
    <div className="max-w-2xl p-6">
      <DataSourceForm onSubmit={(data) => console.log('Data source submitted:', data)} />
    </div>
  );
}
