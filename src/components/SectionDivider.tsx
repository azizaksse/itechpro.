const SectionDivider = ({ className = "" }: { className?: string }) => (
  <div className={`py-4 ${className}`}>
    <div className="mx-auto max-w-sm border-t-2 border-dashed border-primary/30" />
  </div>
);

export default SectionDivider;
