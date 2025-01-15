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

export const smartDummyCode = `I'll create an interactive UI that explains FOIL multiplication for polynomials with a step-by-step solution.

<scratchpad>
Let's break this down into clear visual steps:
1. First, we need to show the distribution of each term
2. Create an animated connection between terms being multiplied
3. Show the collection of like terms
4. Present the final simplified expression

We'll use:
- SVG lines for FOIL connections
- Animated transitions for each step
- Color coding for like terms
- Cards for each step
- Interactive hover effects
</scratchpad>

<imports>
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronRight, Plus, Minus } from "lucide-react"
</imports>

<code>
const SolutionComponent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const steps = [
    {
      id: 1,
      title: "Identify Terms",
      content: "We have (3x³ + 2x - 5)(4x - 3)"
    },
    {
      id: 2,
      title: "Distribute First Term",
      content: "3x³(4x) + 3x³(-3)"
    },
    {
      id: 3,
      title: "Distribute Second Term",
      content: "2x(4x) + 2x(-3)"
    },
    {
      id: 4,
      title: "Distribute Third Term",
      content: "-5(4x) + (-5)(-3)"
    },
    {
      id: 5,
      title: "Simplify Each Term",
      content: "12x⁴ - 9x³ + 8x² - 6x - 20x + 15"
    },
    {
      id: 6,
      title: "Combine Like Terms",
      content: "12x⁴ - 9x³ + 8x² - 26x + 15"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Polynomial Multiplication Solution
      </h1>

      {/* FOIL Diagram */}
      <Card className="p-6 relative">
        <div className="flex justify-center items-center space-x-8">
          <div className="flex flex-col items-center space-y-4">
            <motion.div 
              className="text-2xl font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              (3x³ + 2x - 5)
            </motion.div>
            <motion.div 
              className="text-2xl font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              (4x - 3)
            </motion.div>
          </div>

          <svg className="w-64 h-32">
            {currentStep >= 2 && (
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
                d="M 10,10 L 150,10"
                stroke="blue"
                strokeWidth="2"
                fill="none"
              />
            )}
            {/* Add more animated paths for other connections */}
          </svg>
        </div>
      </Card>

      {/* Step by Step Solution */}
      <div className="space-y-4">
        {steps.map((step) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: currentStep >= step.id ? 1 : 0.5,
              y: 0 
            }}
            className="relative"
          >
            <Card 
              className={\`p-4 \${currentStep === step.id ? 'border-blue-500 border-2' : ''}\`}
              onClick={() => setCurrentStep(step.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {step.id}
                </div>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-lg mt-2">{step.content}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
          onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
          disabled={currentStep === steps.length}
        >
          Next
        </button>
      </div>

      {/* Final Answer Box */}
      {currentStep === steps.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8"
        >
          <Card className="p-6 bg-green-50">
            <h3 className="text-xl font-bold text-center text-green-700">
              Final Answer
            </h3>
            <p className="text-2xl text-center mt-4">
              12x⁴ - 9x³ + 8x² - 26x + 15
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
</code>

<exports>
export default SolutionComponent;
</exports>

This solution creates an interactive UI that:
1. Shows the polynomial multiplication step by step
2. Uses animations to demonstrate the FOIL method
3. Highlights current steps
4. Allows users to navigate through steps
5. Shows a clear final answer
6. Uses color coding and visual hierarchy to make the solution clear
7. Implements interactive elements to engage students

The component uses:
- Framer Motion for smooth animations
- Cards for organizing content
- SVG paths for FOIL connections
- Step-by-step navigation
- Responsive design
- Clear typography hierarchy

Students can click through each step to understand the process, with visual aids helping to reinforce the concepts.
`