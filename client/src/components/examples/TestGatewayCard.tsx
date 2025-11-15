import TestGatewayCard from '../TestGatewayCard';

export default function TestGatewayCardExample() {
  return (
    <div className="max-w-2xl p-6">
      <TestGatewayCard onTest={(data) => console.log('Gateway test:', data)} />
    </div>
  );
}
