export function ClusterLogo({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  return <span className={`inline-block shrink-0 overflow-hidden ${compact ? 'w-9 h-[33px]' : 'w-[148px] h-[45px]'} ${className}`}>
    <img src="/brand/cluster-logo.png" alt="Cluster" className={`${compact ? 'h-[33px]' : 'h-[45px]'} w-auto max-w-none`} />
  </span>;
}
