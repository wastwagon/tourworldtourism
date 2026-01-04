interface SectionHeaderProps {
  title: string
  titleHighlight?: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ title, titleHighlight, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <div className={`text-center mb-10 ${className}`}>
      {/* Premium Decorative Element */}
      <div className="flex items-center justify-center mb-5">
        <div className="h-px w-8 bg-gradient-to-r from-transparent via-red-600/60 to-red-600/60"></div>
        <div className="mx-2 w-1.5 h-1.5 rounded-full bg-red-600/80"></div>
        <div className="h-px w-6 bg-gradient-to-r from-yellow-500/60 via-yellow-500/60 to-transparent"></div>
        <div className="mx-1.5 w-1 h-1 rounded-full bg-yellow-500/80"></div>
        <div className="h-px w-4 bg-gradient-to-r from-green-600/60 to-transparent"></div>
      </div>
      
      {/* Title with Premium Typography */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 tracking-wide">
        {title}
        {titleHighlight && (
          <span className="text-red-600 ml-1.5 font-bold">{titleHighlight}</span>
        )}
      </h2>
      
      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs sm:text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed font-light px-2">
          {subtitle}
        </p>
      )}
      
      {/* Subtle Bottom Accent */}
      <div className="flex items-center justify-center mt-5">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>
    </div>
  )
}

