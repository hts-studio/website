import { useEffect, useRef, useState } from 'react'
import Brand from './assets/brand.svg'

export default function App() {
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth)
    const [canvasHeight, setCanvasHeight] = useState(window.innerHeight)

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const brandRef = useRef<HTMLImageElement | null>(null)
    const debugRef = useRef(false)

    useEffect(() => {
        const canvas = canvasRef.current
        const brand = brandRef.current
        debugRef.current = false

        if (!canvas || !brand) return
        const ctx = canvas.getContext('2d')!

        const randomize = (max: number) => {
            return (Math.random() * max) / 2
        }

        let x = randomize(canvas.width)
        let y = randomize(canvas.height)
        let vx = 1
        let vy = 1

        const updateCanvasSize = () => {
            setCanvasWidth(window.innerWidth)
            setCanvasHeight(window.innerHeight)
        }

        window.addEventListener('resize', updateCanvasSize)

        window.addEventListener('keydown', (e: any) => {
            if (e.code === 'KeyE') {
                debugRef.current = !debugRef.current
            } else if (e.code === 'KeyD') {
                window.open('https://discord.gg/x8BHPftbar', '_blank')
            }
        })

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
            gradient.addColorStop(
                0,
                `hsl(${Math.sin(Date.now() * 0.001) * 60 + 270}, 100%, 50%)`
            )
            gradient.addColorStop(
                1,
                `hsl(${Math.sin(Date.now() * 0.001) * 60 + 150}, 100%, 50%)`
            )

            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.globalCompositeOperation = 'destination-atop'

            ctx.drawImage(brand, x, y, brand.width / 1.5, brand.height / 1.5)

            ctx.globalCompositeOperation = 'destination-over'

            if (debugRef.current) {
                const lineX = x + brand.width / 1.5 / 2
                const lineY = y + brand.height / 1.5 / 2

                /**
                 * Debug Line (Red: Center)
                 */
                ctx.strokeStyle = 'red'
                ctx.beginPath()
                ctx.moveTo(canvas.width / 2, canvas.height / 2)
                ctx.lineTo(lineX, lineY)
                ctx.stroke()

                /**
                 * Debug Line (Green: Facing direction)
                 */
                const angle = Math.atan2(vy, vx)
                const endX = lineX + 300 * Math.cos(angle)
                const endY = lineY + 300 * Math.sin(angle)

                ctx.strokeStyle = 'green'
                ctx.beginPath()
                ctx.moveTo(lineX, lineY)
                ctx.lineTo(endX, endY)
                ctx.stroke()

                /**
                 * Debug Text
                 */
                const textX = Math.min(
                    Math.max(lineX - 25, 0),
                    canvas.width - 120
                )
                const textY = Math.min(
                    Math.max(lineY + brand.height / 1.5 / 2 + 20, 0),
                    canvas.height - 80
                )

                ctx.fillStyle = 'white'
                ctx.font = '14px Rubik'
                ctx.textAlign = 'left'
                ctx.fillText(`x: ${x.toFixed(2)}`, textX, textY)
                ctx.fillText(`y: ${y.toFixed(2)}`, textX, textY + 20)
                ctx.fillText(`vx: ${vx.toFixed(2)}`, textX, textY + 40)
                ctx.fillText(`vy: ${vy.toFixed(2)}`, textX, textY + 60)
            }

            ctx.fillStyle = 'white'
            ctx.font = '14px Rubik'
            ctx.textAlign = 'left'
            ctx.fillText(`[D] Discord`, 5, 15)
            ctx.fillText(`[E] Debug`, 5, 35)

            x += vx
            y += vy

            if (x + brand.width / 1.5 > canvas.width || x < 0) {
                vx = -vx
            }

            if (y + brand.height / 1.5 > canvas.height || y < 0) {
                vy = -vy
            }

            requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', updateCanvasSize)
        }
    }, [canvasWidth, canvasHeight])

    return (
        <>
            <canvas
                ref={canvasRef}
                id="landing__canvas"
                width={canvasWidth}
                height={canvasHeight}
            ></canvas>
            <img
                ref={brandRef}
                src={Brand}
                alt="Brand"
                style={{ display: 'none' }}
            />
        </>
    )
}
