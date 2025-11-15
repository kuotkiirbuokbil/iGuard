import StatCard from '../StatCard';
import { DollarSign } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      <StatCard title="Total Earnings" value="$1,234.56" icon={DollarSign} subtitle="+12% from last month" />
    </div>
  );
}
