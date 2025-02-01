export const ThinkingIndicator = () => (
  <div className="flex items-center gap-1">
    <span className="text-sm text-gray-500">Drafting your solution</span>
    <span className="flex gap-1">
      <span className="inline-block h-1 w-1 animate-[bounce_1s_infinite] rounded-full bg-gray-500 [animation-delay:-0.5s]" />
      <span className="inline-block h-1 w-1 animate-[bounce_1s_infinite] rounded-full bg-gray-500 [animation-delay:-0.4s]" />
      <span className="inline-block h-1 w-1 animate-[bounce_1s_infinite] rounded-full bg-gray-500 [animation-delay:-0.3s]" />
      <span className="inline-block h-1 w-1 animate-[bounce_1s_infinite] rounded-full bg-gray-500 [animation-delay:-0.2s]" />
      <span className="inline-block h-1 w-1 animate-[bounce_1s_infinite] rounded-full bg-gray-500 [animation-delay:-0.1s]" />
    </span>
  </div>
)
