// @example_height 650
import * as React from "react"
import {
  Mafs,
  useMovablePoint,
  FunctionGraph,
  Polygon,
  CartesianCoordinates,
  useStopwatch,
} from "mafs"

import range from "lodash.range"
import { easeInOutCubic } from "js-easing-functions"

interface Partition {
  polygon: [number, number][]
  area: number
}

export default function RiemannHomepage() {
  // Inputs
  const numPartitions = 40

  const from = -0.25
  const to = 1.55

  const duration = 2
  const { time, start } = useStopwatch({
    endTime: duration,
  })
  const value = easeInOutCubic(time, 0, 1, duration)

  React.useEffect(() => start(), [start])
  React.useEffect(() => {
    time === duration && setReady(true)
  }, [time, duration])

  const a = useMovablePoint([from, 0], {
    constrain: "horizontal",
  })
  const b = useMovablePoint([to, 0], {
    constrain: "horizontal",
  })
  const [ready, setReady] = useState(false)

  // The function
  const fn = (x: number) =>
    3.7 * x ** 3 - 6 * x ** 2 + x + 0.7

  const bx = a.x + (b.x - a.x) * value

  // Outputs
  const dx = (bx - a.x) / numPartitions
  const partitions: Partition[] = range(
    a.x,
    bx - dx / 2,
    dx
  ).map((x) => {
    const yMid = fn(x + dx / 2)

    return {
      polygon: [
        [x, 0],
        [x, yMid],
        [x + dx, yMid],
        [x + dx, 0],
      ],
      area: dx * yMid,
    }
  })

  return (
    <Mafs
      xAxisExtent={[-0.4, 1.7]}
      yAxisExtent={[-0.9, 4.5]}
      pan={false}
    >
      <CartesianCoordinates
        yAxis={{
          axis: false,
          lines: false,
          labels: false,
        }}
        xAxis={{ axis: true, labels: false }}
      />

      <FunctionGraph.OfX y={fn} color="#358CF1" />

      {partitions.map((partition, index) => (
        <Polygon
          key={index}
          points={partition.polygon}
          color={
            partition.area >= 0 ? "#08A029" : "#A00863"
          }
          fillOpacity={0.1}
        />
      ))}

      <g
        style={{
          transition: "all 0.4s ease",
          pointerEvents: ready ? "auto" : "none",
          touchAction: ready ? "auto" : "none",
        }}
        opacity={ready ? 1 : 0}
      >
        {a.element}
        {b.element}
      </g>
    </Mafs>
  )
}
