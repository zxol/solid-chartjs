import Chart, { ChartData, ChartItem } from 'chart.js/auto'
import { createEffect, mergeProps, on, onCleanup, onMount } from 'solid-js'
import { unwrap } from 'solid-js/store'
import { ChartJsProps } from './types'

export default function ChartJs(props: ChartJsProps) {
    let chart: Chart
    let canvasRef: HTMLCanvasElement | undefined

    const merged = mergeProps(
        {
            width: 512,
            height: 512,
            type: 'line',
            data: {} as ChartData,
        },
        props
    )

    onMount(() => {
        const ctx = canvasRef?.getContext('2d') as ChartItem
        const config = unwrap(merged)
        chart = new Chart(ctx, {
            type: config.type,
            data: config.data,
            options: config.options,
        })
    })

    createEffect(
        on(
            () => merged.data,
            () => {
                chart.data = merged.data
                chart.update()
            },
            {
                defer: true,
            }
        )
    )

    createEffect(
        on(
            [() => merged.width, () => merged.height],
            () => {
                chart.resize(merged.width, merged.height)
            },
            {
                defer: true,
            }
        )
    )

    onCleanup(() => {
        chart?.destroy()
    })

    return (
        <canvas
            ref={canvasRef}
            role="img"
            height={merged.height}
            width={merged.width}
        >
            {merged.fallback}
        </canvas>
    )
}