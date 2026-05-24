import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({
  children,
  animation = 'slide-up', // 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale-in'
  duration = 700, // in ms
  delay = 0, // in ms
  threshold = 0.1,
  className = '',
}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          // Once it intersects, we can unobserve if we only want it to animate once
          if (ref.current) observer.unobserve(ref.current)
        }
      },
      { threshold }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold])

  const getAnimationStyles = () => {
    const baseStyle = {
      transitionProperty: 'opacity, transform',
      transitionDuration: `${duration}ms`,
      transitionDelay: `${delay}ms`,
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', // Premium easing
    }

    if (isIntersecting) {
      return {
        ...baseStyle,
        opacity: 1,
        transform: 'translate(0, 0) scale(1)',
      }
    }

    // Initial state before intersection
    switch (animation) {
      case 'fade':
        return {
          ...baseStyle,
          opacity: 0,
        }
      case 'slide-up':
        return {
          ...baseStyle,
          opacity: 0,
          transform: 'translateY(40px)',
        }
      case 'slide-down':
        return {
          ...baseStyle,
          opacity: 0,
          transform: 'translateY(-40px)',
        }
      case 'slide-left':
        return {
          ...baseStyle,
          opacity: 0,
          transform: 'translateX(40px)',
        }
      case 'slide-right':
        return {
          ...baseStyle,
          opacity: 0,
          transform: 'translateX(-40px)',
        }
      case 'scale-in':
        return {
          ...baseStyle,
          opacity: 0,
          transform: 'scale(0.92)',
        }
      default:
        return {
          ...baseStyle,
          opacity: 0,
          transform: 'translateY(40px)',
        }
    }
  }

  return (
    <div ref={ref} style={getAnimationStyles()} className={className}>
      {children}
    </div>
  )
}
