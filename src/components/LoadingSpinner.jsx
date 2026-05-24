export default function LoadingSpinner({ size = 'md', fullScreen = false }) {
  const sizeMap = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' }
  const sizeClass = sizeMap[size] || sizeMap.md

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizeClass} border-[3px] border-brand border-t-transparent rounded-full animate-spin`} />
      <p className="text-xs text-text-muted font-medium">Loading...</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        {spinner}
      </div>
    )
  }

  return <div className="flex justify-center py-16">{spinner}</div>
}
