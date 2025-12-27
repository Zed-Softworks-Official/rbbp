/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import nextra from "nextra";
import "./src/env";
import type { NextConfig } from "next";

const withNextra = nextra({

})

const config = {
    turbopack: {
        resolveAlias: {
            'next-mdx-import-source-file': './src/mdx-components.tsx'
        }
    }
} satisfies NextConfig;

export default withNextra(config);
