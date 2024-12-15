export default function Link({ href, children, className='link-action' }: { href: string; children: React.ReactNode, className?: string }) {
    return <a href={href} className={className}>{children}</a>;
}