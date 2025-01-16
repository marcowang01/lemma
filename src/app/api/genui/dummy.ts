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

export const graph1 = "<code>\nconst SolutionComponent = () => {\n  // Generate points for the parabola\n  const generatePoints = () => {\n    const points = [];\n    for (let x = -3; x <= 2; x += 0.1) {\n      points.push({\n        x: x,\n        y: x * x + x - 1\n      });\n    }\n    return points;\n  };\n\n  // The roots are (-1.618034, 0) and (0.618034, 0)\n  const data = generatePoints();\n\n  return (\n    <div className=\"space-y-4\">\n      {/* Theory Card */}\n      <Card>\n        <CardHeader>\n          <CardTitle>Quadratic Equation Theory</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <p className=\"mb-4\">For a quadratic equation in the form:</p>\n          <BlockMath>{`ax^2 + bx + c = 0`}</BlockMath>\n          <p className=\"mt-4\">The roots can be found using the quadratic formula:</p>\n          <BlockMath>{`x = \\\\frac{-b \\\\pm \\\\sqrt{b^2 - 4ac}}{2a}`}</BlockMath>\n        </CardContent>\n      </Card>\n\n      {/* Step 1 */}\n      <Card>\n        <CardHeader>\n          <CardTitle>Step 1: Identify the coefficients</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <p>From the equation <InlineMath>{`x^2 + x - 1 = 0`}</InlineMath>:</p>\n          <ul className=\"list-disc list-inside space-y-2 mt-2\">\n            <li><InlineMath>{`a = 1`}</InlineMath></li>\n            <li><InlineMath>{`b = 1`}</InlineMath></li>\n            <li><InlineMath>{`c = -1`}</InlineMath></li>\n          </ul>\n        </CardContent>\n      </Card>\n\n      {/* Step 2 */}\n      <Card>\n        <CardHeader>\n          <CardTitle>Step 2: Apply the Quadratic Formula</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <BlockMath>{`x = \\\\frac{-1 \\\\pm \\\\sqrt{1^2 - 4(1)(-1)}}{2(1)}`}</BlockMath>\n          <BlockMath>{`x = \\\\frac{-1 \\\\pm \\\\sqrt{1 + 4}}{2}`}</BlockMath>\n          <BlockMath>{`x = \\\\frac{-1 \\\\pm \\\\sqrt{5}}{2}`}</BlockMath>\n        </CardContent>\n      </Card>\n\n      {/* Step 3 - Final Answer */}\n      <Card className=\"bg-green-50\">\n        <CardHeader>\n          <CardTitle>Step 3: Calculate the Roots</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <p>The two roots are:</p>\n          <div className=\"mt-4 space-y-2\">\n            <BlockMath>{`x_1 = \\\\frac{-1 + \\\\sqrt{5}}{2} \\\\approx 0.618034`}</BlockMath>\n            <BlockMath>{`x_2 = \\\\frac{-1 - \\\\sqrt{5}}{2} \\\\approx -1.618034`}</BlockMath>\n          </div>\n        </CardContent>\n      </Card>\n\n      {/* Graph */}\n      <Card>\n        <CardHeader>\n          <CardTitle>Graphical Representation</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <div className=\"h-[400px] w-full\">\n            <ResponsiveContainer width=\"100%\" height=\"100%\">\n              <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>\n                <CartesianGrid strokeDasharray=\"3 3\" />\n                <XAxis \n                  domain={[-3, 2]} \n                  type=\"number\"\n                  dataKey=\"x\"\n                  label={{ value: 'x', position: 'bottom' }}\n                />\n                <YAxis \n                  domain={[-3, 3]} \n                  label={{ value: 'y', angle: -90, position: 'left' }}\n                />\n                <Tooltip />\n                <ReferenceLine x={0} stroke=\"#666\" />\n                <ReferenceLine y={0} stroke=\"#666\" />\n                {/* Mark the roots */}\n                <ReferenceDot x={0.618034} y={0} r={5} fill=\"red\" />\n                <ReferenceDot x={-1.618034} y={0} r={5} fill=\"red\" />\n                <Line \n                  type=\"monotone\" \n                  dataKey=\"y\" \n                  stroke=\"#8884d8\" \n                  dot={false}\n                  name=\"f(x) = x² + x - 1\"\n                />\n              </LineChart>\n            </ResponsiveContainer>\n          </div>\n          <div className=\"mt-4\">\n            <p className=\"text-sm text-gray-600\">\n              The red dots indicate the roots of the equation where the parabola crosses the x-axis.\n            </p>\n          </div>\n        </CardContent>\n      </Card>\n    </div>\n  );\n};\n</code>\n\nI've created a comprehensive solution that includes:\n\n1. A theory card explaining the quadratic formula\n2. Step-by-step solution showing how to find the roots\n3. The final answer highlighted in a green-tinted card\n4. An interactive graph showing:\n   - The parabola representing <InlineMath>f(x) = x^2 + x - 1</InlineMath>\n   - The roots marked with red dots\n   - Grid lines and axes for reference\n   - Interactive tooltip showing coordinates when hovering\n   - Clear labeling of axes\n\nThe graph clearly shows that the parabola crosses the x-axis at two points:\n- <InlineMath>x_1 \\approx 0.618034</InlineMath> (the positive root)\n- <InlineMath>x_2 \\approx -1.618034</InlineMath> (the negative root)\n\nYou can hover over the graph to see the exact y-values at any point, and the red dots highlight where the parabola intersects wi"