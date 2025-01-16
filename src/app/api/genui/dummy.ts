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

export const graph1 = "<code>\nconst SolutionComponent = () => {\n  // Calculate depreciation values for each year\n  const initialValue = 20000;\n  const depreciationRate = 0.15;\n  const years = [0, 1, 2, 3];\n  \n  const data = years.map(year => ({\n    year,\n    value: initialValue * Math.pow(1 - depreciationRate, year)\n  }));\n\n  return (\n    <div className=\"space-y-6\">\n      {/* Theory Card */}\n      <Card>\n        <CardHeader>\n          <CardTitle>Depreciation Formula</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <p className=\"mb-4\">When calculating depreciation with a fixed rate, we use the compound depreciation formula:</p>\n          <BlockMath>\n            {\"FinalValue = InitialValue \\\\times (1 - rate)^{years}\"}\n          </BlockMath>\n        </CardContent>\n      </Card>\n\n      {/* Step 1 */}\n      <Card>\n        <CardHeader>\n          <CardTitle>Step 1: Identify the Values</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <ul className=\"list-disc list-inside space-y-2\">\n            <li>Initial Value: <InlineMath>{\"\\\\$20,000\"}</InlineMath></li>\n            <li>Depreciation Rate: <InlineMath>{\"15\\\\% = 0.15\"}</InlineMath></li>\n            <li>Time Period: <InlineMath>{\"3\"}</InlineMath> years</li>\n          </ul>\n        </CardContent>\n      </Card>\n\n      {/* Step 2 */}\n      <Card>\n        <CardHeader>\n          <CardTitle>Step 2: Apply the Formula</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <div className=\"space-y-4\">\n            <BlockMath>\n              {\"FinalValue = \\\\$20,000 \\\\times (1 - 0.15)^3\"}\n            </BlockMath>\n            <BlockMath>\n              {\"= \\\\$20,000 \\\\times (0.85)^3\"}\n            </BlockMath>\n            <BlockMath>\n              {\"= \\\\$20,000 \\\\times 0.614125\"}\n            </BlockMath>\n            <BlockMath>\n              {\"= \\\\$12,282.50\"}\n            </BlockMath>\n          </div>\n        </CardContent>\n      </Card>\n\n      {/* Visualization Card */}\n      <Card>\n        <CardHeader>\n          <CardTitle>Car Value Depreciation Over Time</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <div className=\"h-[300px] w-full\">\n            <ResponsiveContainer width=\"100%\" height=\"100%\">\n              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>\n                <CartesianGrid strokeDasharray=\"3 3\" />\n                <XAxis \n                  dataKey=\"year\" \n                  label={{ value: 'Years', position: 'bottom' }}\n                />\n                <YAxis \n                  label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }}\n                  domain={[0, 'dataMax']}\n                  tickFormatter={(value) => `$${value.toLocaleString()}`}\n                />\n                <Tooltip \n                  formatter={(value) => [`$${value.toFixed(2).toLocaleString()}`, 'Value']}\n                  labelFormatter={(value) => `Year ${value}`}\n                />\n                <Line \n                  type=\"monotone\" \n                  dataKey=\"value\" \n                  stroke=\"#2563eb\" \n                  strokeWidth={2}\n                  dot={{ fill: \"#2563eb\" }}\n                />\n              </LineChart>\n            </ResponsiveContainer>\n          </div>\n        </CardContent>\n      </Card>\n\n      {/* Final Answer Card */}\n      <Card className=\"bg-green-50\">\n        <CardHeader>\n          <CardTitle>Final Answer</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <p className=\"text-lg\">\n            After 3 years, the car's value will be <span className=\"font-bold text-green-700\">$12,282.50</span>\n          </p>\n          <p className=\"text-sm text-gray-600 mt-2\">\n            This represents a total depreciation of <span className=\"font-bold\">${(20000 - 12282.50).toFixed(2)}</span> or <span className=\"font-bold\">38.59%</span> from the original value.\n          </p>\n        </CardContent>\n      </Card>\n    </div>\n  );\n};\n</code>"