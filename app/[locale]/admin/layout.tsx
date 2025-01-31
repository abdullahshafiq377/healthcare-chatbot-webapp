"use client";
import { Card, CardBody } from "@heroui/card";

import AdminSideNav from "@/components/admin-side-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col h-full items-center justify-center gap-4">
      <div className="inline-block w-full h-full justify-center py-6">
        <div className="flex w-full h-full gap-10">
          <AdminSideNav />
          <Card className="h-[calc(100vh-64px-48px)] w-full">
            <CardBody>{children}</CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
