import { useEffect, useRef } from 'react'

type Particle = { x: number; y: number; vx: number; vy: number; size: number }

export default function NeuralField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const context = canvas.getContext('2d')
    if (!context) return

    let animationFrame = 0
    let particles: Particle[] = []
    let dimensions = { width: 0, height: 0 }
    const pointer = { x: -9999, y: -9999 }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio, 2)
      dimensions = { width: rect.width, height: rect.height }
      canvas.width = rect.width * ratio
      canvas.height = rect.height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const count = Math.max(28, Math.min(68, Math.floor((rect.width * rect.height) / 26000)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        size: Math.random() * 1.2 + 0.5,
      }))
    }

    const movePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
    }

    const clearPointer = () => { pointer.x = -9999; pointer.y = -9999 }

    const render = () => {
      context.clearRect(0, 0, dimensions.width, dimensions.height)
      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        if (particle.x < 0 || particle.x > dimensions.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > dimensions.height) particle.vy *= -1
      })

      for (let first = 0; first < particles.length; first += 1) {
        const particle = particles[first]
        const pointerDistance = Math.hypot(pointer.x - particle.x, pointer.y - particle.y)
        const pointAlpha = pointerDistance < 180 ? 0.8 : 0.32
        context.beginPath()
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.fillStyle = `rgba(165, 231, 255, ${pointAlpha})`
        context.fill()

        for (let second = first + 1; second < particles.length; second += 1) {
          const other = particles[second]
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y)
          if (distance > 135) continue
          const alpha = (1 - distance / 135) * (pointerDistance < 210 ? 0.36 : 0.13)
          context.beginPath()
          context.moveTo(particle.x, particle.y)
          context.lineTo(other.x, other.y)
          context.strokeStyle = `rgba(71, 214, 255, ${alpha})`
          context.lineWidth = 0.65
          context.stroke()
        }
      }
      animationFrame = window.requestAnimationFrame(render)
    }

    resize()
    render()
    window.addEventListener('resize', resize)
    canvas.addEventListener('pointermove', movePointer)
    canvas.addEventListener('pointerleave', clearPointer)
    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', movePointer)
      canvas.removeEventListener('pointerleave', clearPointer)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-auto absolute inset-0 h-full w-full opacity-25" aria-hidden="true" />
}
