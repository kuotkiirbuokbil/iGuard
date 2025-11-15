import { useState } from 'react';
import AgentDetailsCard from '../AgentDetailsCard';

export default function AgentDetailsCardExample() {
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);

  return (
    <div className="max-w-2xl p-6">
      <AgentDetailsCard
        agentId="agent-demo-abc123def456"
        agentName="Demo Agent"
        apiKey={apiKey}
        onGenerateKey={() => setApiKey('sk_live_demo_' + Math.random().toString(36).substr(2, 32))}
      />
    </div>
  );
}
