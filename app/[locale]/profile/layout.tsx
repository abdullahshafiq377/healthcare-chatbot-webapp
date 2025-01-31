export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col h-full items-center justify-center gap-4">
      <div className="inline-block w-full h-full text-center justify-center py-6">
        {children}
      </div>
    </section>
  );
}
