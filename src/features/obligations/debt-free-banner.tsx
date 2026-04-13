import { formatDistanceToNow } from "date-fns"
import { TrophyIcon } from "lucide-react"
import { computeDebtFreeBanner, formatPHP } from "./helpers"
import type { Obligation } from "@/generated/prisma/browser"
import { Progress } from "@/components/ui/progress"
import { Text } from "@/components/text"

interface DebtFreeBannerProps {
  obligations: Array<Obligation>
}

export function DebtFreeBanner({ obligations }: DebtFreeBannerProps) {
  const data = computeDebtFreeBanner(obligations)
  if (!data) return null

  const { formattedTarget, targetDate, overallProgress, totalRemaining } = data

  const distanceLabel = formatDistanceToNow(targetDate, { addSuffix: true })

  return (
    <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-emerald-950/60 to-emerald-900/30 px-5 py-4 ring-1 ring-emerald-800/40">
      {/* background glow */}
      <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative space-y-3">
        {/* row 1 – title */}
        <div className="flex items-center gap-2">
          <TrophyIcon className="size-3.5 text-emerald-400" />
          <Text size="sm" weight="semibold" className="text-emerald-300">
            Debt-free target
          </Text>
        </div>

        {/* row 2 – date · distance */}
        <div className="flex items-baseline gap-2">
          <Text size="2xl" weight="bold" className="font-mono text-white">
            {formattedTarget}
          </Text>
          <Text
            size="xs"
            weight="bold"
            variant="muted"
            className="text-emerald-300"
          >
            · {distanceLabel}
          </Text>
        </div>

        {/* row 3 – progress */}
        <div className="space-y-1.5">
          <Progress
            value={overallProgress}
            className="h-1.5 bg-emerald-950/60 *:data-[slot=progress-indicator]:bg-emerald-400"
          />
          <div className="flex justify-between">
            <Text size="xxs" weight="semibold">
              {overallProgress.toFixed(0)}% paid off
            </Text>
            <Text size="xxs" weight="semibold">
              {formatPHP(totalRemaining)} remaining
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}
