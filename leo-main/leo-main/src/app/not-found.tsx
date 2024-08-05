'use client';

import PrimaryCTA from '@/components/primary-cta';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-2xl font-semibold text-gray-600 mb-4">
          Page Not Found
        </p>
        <p className="text-gray-500">
          The page you are looking for might be under construction or does not
          exist.
        </p>
        <div className="mt-4 flex justify-center items-center">
          <PrimaryCTA
            ctaText="Go back Home"
            onClick={() => router.replace('/overview')}
          />
        </div>
      </div>
    </div>
  );
}
