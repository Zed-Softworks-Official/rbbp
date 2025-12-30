import { useMDXComponents as getThemComponents } from 'nextra-theme-docs'

// Merge components
export function useMDXComponents(components: Record<string, React.ComponentType>) {
    const themeComponents = getThemComponents()

    return {
        ...themeComponents,
        ...components
    }
}
