import { useEffect, useRef, useState } from 'react'
import Brand from './assets/brand.svg'
import DvD from './assets/dvd.svg'

export default function App() {
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth)
    const [canvasHeight, setCanvasHeight] = useState(window.innerHeight)
    const [currentLogo, setCurrentLogo] = useState(Brand)

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const brandRef = useRef<HTMLImageElement | null>(null)
    const debugRef = useRef(false)
    const frameCounterRef = useRef(0)
    const lastFrameTimeRef = useRef(performance.now())

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
            } else if (e.code === 'KeyQ') {
                setCurrentLogo((prevLogo) => (prevLogo === DvD ? Brand : DvD))
            }
        })

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
            gradient.addColorStop(
                0,
                `hsl(${Math.sin(Date.now() * 0.001) * 60 + 270}, 100%, 50%)`,
            )
            gradient.addColorStop(
                1,
                `hsl(${Math.sin(Date.now() * 0.001) * 60 + 150}, 100%, 50%)`,
            )

            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.globalCompositeOperation = 'destination-atop'

            ctx.drawImage(brand, x, y, brand.width / 1.5, brand.height / 1.5)

            ctx.globalCompositeOperation = 'destination-over'

            /** Framerate bs */
            frameCounterRef.current += 1
            const currentTime = performance.now()
            const deltaTime = currentTime - lastFrameTimeRef.current
            const framerate = 1000 / deltaTime
            lastFrameTimeRef.current = currentTime

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
                 * Debug Arc (Blue: Distance between red and green lines)
                 */
                const distance = Math.sqrt(
                    (endX - canvas.width / 2) ** 2 +
                        (endY - canvas.height / 2) ** 2,
                )

                ctx.strokeStyle = 'blue'
                ctx.lineWidth = 2
                const startAngle = Math.atan2(
                    lineY - canvas.height / 2,
                    lineX - canvas.width / 2,
                )
                const endAngle = Math.atan2(
                    endY - canvas.height / 2,
                    endX - canvas.width / 2,
                )

                ctx.beginPath()
                ctx.arc(
                    canvas.width / 2,
                    canvas.height / 2,
                    20,
                    startAngle,
                    endAngle,
                )
                ctx.stroke()

                /**
                 * Debug Text
                 */
                const textX = Math.min(
                    Math.max(lineX - 25, 0),
                    canvas.width - 120,
                )
                const textY = Math.min(
                    Math.max(lineY + brand.height / 1.5 / 2 + 20, 0),
                    canvas.height - 80,
                )

                ctx.fillStyle = 'white'
                ctx.font = '14px Rubik'
                ctx.textAlign = 'left'
                ctx.fillText(`x: ${x.toFixed(2)}`, textX, textY)
                ctx.fillText(`y: ${y.toFixed(2)}`, textX, textY + 20)
                ctx.fillText(`vx: ${vx.toFixed(2)}`, textX, textY + 40)
                ctx.fillText(`vy: ${vy.toFixed(2)}`, textX, textY + 60)
                ctx.textAlign = 'center'
                ctx.fillText(
                    `${distance.toFixed(2)}`,
                    canvas.width / 2,
                    canvas.height / 2 - 30,
                )

                ctx.fillStyle = 'white'
                ctx.font = '14px Rubik'
                ctx.textAlign = 'right'
                ctx.fillText(
                    `FPS: ${framerate.toFixed()}`,
                    canvas.width - 5,
                    15,
                )
            }

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
                src={currentLogo}
                alt="Brand"
                style={{ display: 'none' }}
            />
        </>
    )
}
