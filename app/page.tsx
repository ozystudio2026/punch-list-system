import { Suspense } from 'react';
import InspectionApp from '@/components/InspectionApp';

export default function Home() {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <InspectionApp />
    </Suspense>
  );
}
