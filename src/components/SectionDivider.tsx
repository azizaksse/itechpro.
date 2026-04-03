const SectionDivider = ({ className = "" }: { className?: string }) => (
  <div className={`py-4 ${className}`}>
    <div className="mx-auto max-w-xs border-t border-dashed border-primary/30" />
  </div>
);

export default SectionDivider;
