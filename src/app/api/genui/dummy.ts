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