export const ThinkingIndicator = () => (
  <div className="flex items-baseline gap-1">
    <span className="text-dark-gray text-lg font-light italic">Drafting your solution</span>
    <span className="flex gap-1">
      <span className="bg-dark-gray inline-block h-[3px] w-[3px] animate-[bounce_1s_infinite] rounded-full [animation-delay:-0.5s]" />
      <span className="bg-dark-gray inline-block h-[3px] w-[3px] animate-[bounce_1s_infinite] rounded-full [animation-delay:-0.4s]" />
      <span className="bg-dark-gray inline-block h-[3px] w-[3px] animate-[bounce_1s_infinite] rounded-full [animation-delay:-0.3s]" />
    </span>
  </div>
)
