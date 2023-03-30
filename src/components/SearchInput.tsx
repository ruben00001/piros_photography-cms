import { SearchIcon, XCircleIcon } from "./Icon";
import WithTooltip from "./data-display/WithTooltip";

const inputId = "default-search";

const SearchInput = ({
  placeholder = "Search",
  inputValue,
  setInputValue,
}: {
  placeholder?: string;
  inputValue: string;
  setInputValue: (inputValue: string) => void;
}) => {
  return (
    <>
      <label
        htmlFor={inputId}
        className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Search
      </label>
      <div className="relative w-full max-w-[500px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon />
        </div>
        <input
          type="text"
          id={inputId}
          className="block w-full rounded-md border border-base-300 px-xs py-xs pl-10 text-sm text-gray-900 outline-none transition-colors focus-within:bg-gray-50"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoComplete="off"
        />
        {inputValue.length ? (
          <WithTooltip text="clear input">
            <button
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-300 transition-all duration-75 ease-in-out hover:bg-gray-100 hover:text-gray-600"
              onClick={() => setInputValue("")}
              type="button"
            >
              <XCircleIcon />
            </button>
          </WithTooltip>
        ) : null}
      </div>
    </>
  );
};

export default SearchInput;
