export default function ProdutoSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-zinc-200 aspect-[3/4] w-full" />
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-zinc-200 rounded w-3/4" />
        <div className="h-4 bg-zinc-200 rounded w-1/3" />
      </div>
    </div>
  );
}
