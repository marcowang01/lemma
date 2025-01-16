export const dummyCode = `
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
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
`

export const smartDummyCode = `I'll help create an interactive and visually appealing solution for expanding this polynomial using the FOIL method, but extended for a trinomial times binomial.

<scratchpad>
Let's break this down into clear visual steps:
1. First, we'll show the original expression
2. Then show how each term in the first bracket multiplies with each term in the second
3. Use color coding and connecting lines to show multiplication pairs
4. Group like terms
5. Show final simplified expression

We'll use animations and visual aids to make the distribution process clear.
</scratchpad>

<imports>
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { useState } from "react"
</imports>

<code>
const SolutionComponent = () => {
  const [step, setStep] = useState(1);
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">
        Expanding $(3x^3+2x-5)(4x-3)$
      </h1>

      <div className="space-y-8">
        {/* Step 1: Distribution Visualization */}
        <motion.div {...fadeIn} className="relative">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Step 1: Distribution</h2>
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 text-lg">
                <div className="text-blue-500">$(3x^3+2x-5)$</div>
                <div className="text-green-500">$(4x-3)$</div>
              </div>
              <div className="border-l-2 border-dashed h-8"></div>
              <div className="grid grid-cols-1 gap-2">
                <div className="text-blue-500">$3x^3 \cdot 4x = 12x^4$</div>
                <div className="text-blue-500">$3x^3 \cdot (-3) = -9x^3$</div>
                <div className="text-purple-500">$2x \cdot 4x = 8x^2$</div>
                <div className="text-purple-500">$2x \cdot (-3) = -6x$</div>
                <div className="text-red-500">$-5 \cdot 4x = -20x$</div>
                <div className="text-red-500">$-5 \cdot (-3) = 15$</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Step 2: Grouping Like Terms */}
        <motion.div {...fadeIn} className="relative">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Step 2: Grouping Like Terms</h2>
            <div className="space-y-4">
              <div className="text-lg">
                $12x^4 - 9x^3 + 8x^2 - 6x - 20x + 15$
              </div>
              <div className="text-lg text-purple-500">
                Combining like terms: $-6x - 20x = -26x$
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Step 3: Final Answer */}
        <motion.div {...fadeIn} className="relative">
          <Card className="p-6 bg-green-50">
            <h2 className="text-lg font-semibold mb-4">Final Answer:</h2>
            <div className="text-xl text-center text-green-700">
              $12x^4 - 9x^3 + 8x^2 - 26x + 15$
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
</code>

<exports>
export default SolutionComponent;
</exports>

This solution includes:
1. A clear step-by-step breakdown
2. Color coding to help track terms
3. Visual separation of steps
4. Animations using framer-motion
5. Clean UI using shadcn/ui cards
6. Clear typography and spacing
7. Proper LaTeX formatting for mathematical expressions

The solution shows how each term in the first expression multiplies with each term in the second expression, then groups like terms, and finally shows the simplified result. The color coding helps students track where each term comes from in the original expression.`

export const graph1 = "<code>\nconst SolutionComponent = () => {\n  const [radius, setRadius] = useState(1);\n  const calculateVolume = (r) => (4/3) * Math.PI * Math.pow(r, 3);\n  const calculateSurfaceArea = (r) => 4 * Math.PI * Math.pow(r, 2);\n  \n  // Generate data points for the graph\n  const data = Array.from({ length: 50 }, (_, i) => {\n    const r = (i + 1) * 0.2;\n    return {\n      radius: r,\n      volume: calculateVolume(r),\n    };\n  });\n\n  return (\n    <div className=\"space-y-6\">\n      {/* Theory Card */}\n      <Card>\n        <CardHeader>\n          <CardTitle>Volume of a Sphere</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <p className=\"mb-4\">The volume of a sphere is given by the formula:</p>\n          <BlockMath math=\"V = \\frac{4}{3}\\pi r^3\" />\n          <p className=\"mt-4\">where r is the radius of the sphere.</p>\n        </CardContent>\n      </Card>\n\n      {/* Interactive Control Card */}\n      <Card>\n        <CardHeader>\n          <CardTitle>Interactive Sphere Volume Calculator</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <div className=\"space-y-4\">\n            <div>\n              <Label>Radius (r): {radius.toFixed(2)} units</Label>\n              <input\n                type=\"range\"\n                min=\"0.1\"\n                max=\"10\"\n                step=\"0.1\"\n                value={radius}\n                onChange={(e) => setRadius(parseFloat(e.target.value))}\n                className=\"w-full\"\n              />\n            </div>\n            <div className=\"p-4 bg-blue-50 rounded-lg\">\n              <p className=\"font-semibold\">Current Volume:</p>\n              <BlockMath math={`V = \\\\frac{4}{3}\\\\pi (${radius.toFixed(2)})^3 = ${calculateVolume(radius).toFixed(2)}\\\\text{ cubic units}`} />\n            </div>\n          </div>\n        </CardContent>\n      </Card>\n\n      {/* Graph Card */}\n      <Card>\n        <CardHeader>\n          <CardTitle>Volume vs. Radius Relationship</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <div className=\"h-[400px]\">\n            <ResponsiveContainer width=\"100%\" height=\"100%\">\n              <LineChart data={data}>\n                <CartesianGrid strokeDasharray=\"3 3\" />\n                <XAxis \n                  dataKey=\"radius\" \n                  label={{ value: 'Radius (r)', position: 'bottom' }}\n                />\n                <YAxis \n                  label={{ value: 'Volume (V)', angle: -90, position: 'left' }}\n                />\n                <Tooltip formatter={(value) => value.toFixed(2)} />\n                <Line \n                  type=\"monotone\" \n                  dataKey=\"volume\" \n                  stroke=\"#2563eb\" \n                  dot={false}\n                />\n                {/* Add a point to show current radius */}\n                <ReferenceDot\n                  x={radius}\n                  y={calculateVolume(radius)}\n                  r={5}\n                  fill=\"red\"\n                  stroke=\"none\"\n                />\n              </LineChart>\n            </ResponsiveContainer>\n          </div>\n        </CardContent>\n      </Card>\n\n      {/* Analysis Card */}\n      <Card>\n        <CardHeader>\n          <CardTitle>Key Observations</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <div className=\"space-y-4\">\n            <p>Here are some important observations about how the volume changes with radius:</p>\n            <ol className=\"list-decimal list-inside space-y-2\">\n              <li>The relationship is cubic (r³), which means the volume increases very rapidly as the radius increases.</li>\n              <li>When you double the radius, the volume increases by a factor of 8 (2³).</li>\n              <li>The rate of change (derivative) of volume with respect to radius is:\n                <BlockMath math=\"\\frac{dV}{dr} = 4\\pi r^2\" />\n                which is equal to the surface area of the sphere!\n              </li>\n            </ol>\n          </div>\n        </CardContent>\n      </Card>\n    </div>\n  );\n};\n</code>"