import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
  children?: ReactNode
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  children,
}: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header__text">
        {eyebrow ? <span className="page-header__eyebrow">{eyebrow}</span> : null}
        <h1 className="page-header__title">{title}</h1>
        {description ? (
          <p className="page-header__description">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="page-header__actions">{actions}</div> : null}
      {children ? <div className="page-header__extra">{children}</div> : null}
    </div>
  )
}
