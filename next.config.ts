// next.config.ts
import type { NextConfig } from "next"
import type { Configuration as WebpackConfig } from "webpack"

interface WebpackConfigContext {
  buildId: string
  dev: boolean
  isServer: boolean
  defaultLoaders: {
    babel: any
  }
  webpack: any
}

const nextConfig: NextConfig = {
  reactStrictMode: true,

  webpack: (config: WebpackConfig, { isServer, dev }: WebpackConfigContext): WebpackConfig => {
    // Add babel-loader for standalone
    config.module?.rules?.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules\/(?!@babel\/standalone)/,
      use: {
        loader: "babel-loader",
        options: {
          presets: [
            ["@babel/preset-env", { targets: "defaults" }],
            "@babel/preset-typescript",
            ["@babel/preset-react", { runtime: "automatic" }],
          ],
          plugins: ["@babel/plugin-transform-runtime"],
          cacheDirectory: true,
        },
      },
    })

    // Prevent multiple React instances in client
    if (!isServer && config.resolve?.alias) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: require.resolve("react"),
        "react-dom": require.resolve("react-dom"),
      }
    }

    if (!isServer && config.resolve?.fallback) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "react/jsx-runtime": require.resolve("react/jsx-runtime"),
        "react-dom/client": require.resolve("react-dom/client"),
      }
    }

    // Optimize production builds
    if (!dev && config.optimization) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
      }
    }

    return config
  },

  // Optional: Type-safe image domain configuration
  images: {
    domains: [] as string[],
  },

  // Transpile specific modules
  transpilePackages: ["@babel/standalone"],
}

export default nextConfig
