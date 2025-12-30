import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'

// Merge components
export function useMDXComponents(components: Record<string, React.ComponentType>) {
    const themeComponents = getThemeComponents()

    return {
        ...themeComponents,
        ...components
    }
}
