"use client";

import AdminMomentList from '@/src/components/moments/list/admin';
import AdminSidebar from '@/src/components/sidebar/admin';
import { useRequireLogin } from '@/src/features/auth/hooks/useAuth';

export default function Page() {
  useRequireLogin('/');

  return (
    <>
      <div id="main">
        <div className="relative flex flex-col w-full h-full">
          <AdminMomentList />
        </div>
      </div>
      <div id="sidebar">
        <AdminSidebar />
      </div>
    </>
  )
}
