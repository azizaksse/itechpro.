const SectionDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center py-6 ${className}`}>
    <div className="flex items-center gap-2 w-full max-w-md mx-auto">
      <div className="flex-1 h-px border-t border-dashed border-primary/30" />
      <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
      <div className="w-2 h-2 rounded-full bg-primary" />
      <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
      <div className="flex-1 h-px border-t border-dashed border-primary/30" />
    </div>
  </div>
);

export default SectionDivider;
