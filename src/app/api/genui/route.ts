import { transform } from "@babel/standalone"

export async function POST(req: Request) {
  const componentCode = `
    const DynamicChart = () => {
      const data = [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 300 },
        { name: 'Mar', value: 600 }
      ];

      return (
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-500" />
              Chart Example
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart width={500} height={300} data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </CardContent>
        </Card>
      );
    };
  `

  const code = createComponent(componentCode)

  return Response.json({ code: code })
}

export function createComponent(code: string): string {
  // Transform JSX to JavaScript
  const transformed = transform(code, {
    presets: ["react", "typescript"],
    filename: "dynamic.tsx",
    configFile: false,
    babelrc: false,
  }).code

  if (!transformed) {
    throw new Error("Transformation failed")
  }

  return transformed
}