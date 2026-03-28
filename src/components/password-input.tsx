import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  ref?: React.Ref<HTMLInputElement>
}

export function PasswordInput({ ref, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <InputGroup>
      <InputGroupInput ref={ref} type={visible ? "text" : "password"} {...props} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
