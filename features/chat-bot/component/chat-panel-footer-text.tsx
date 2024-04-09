import { ExternalLink } from '@/components/external-link'
import { cn } from '@/lib/utils'

export function ChatPanelFooterText({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className,
      )}
      {...props}
    >
      Wealth Management AI chatbot built with{' '}
      <ExternalLink href="https://nextjs.org">Next.js</ExternalLink> and{' '}
      <ExternalLink href="https://platform.openai.com/">OpenAI</ExternalLink>.
    </p>
  )
}
