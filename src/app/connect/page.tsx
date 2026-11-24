import type { Metadata } from 'next';
import { ConnectSection } from '@/components/connect-section';

export const metadata: Metadata = {
  title: "Let's Connect — Valoria Tech",
  description:
    'Enterprise architecture & engineering inquiry desk. Direct Salesforce CRM integration with sub-24h technical review SLA.',
};

export default function ConnectPage() {
  return (
    <main className="flex-1 w-full min-h-screen bg-[#050608]">
      <ConnectSection standalone />
    </main>
  );
}

