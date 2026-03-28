import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean
}

export function SubmitButton({ loading, disabled, children, ...props }: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={loading || disabled} {...props}>
      {loading && <Spinner data-icon="inline-start" />}
      {children}
    </Button>
  )
}
