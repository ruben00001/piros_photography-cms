import { SearchIcon } from "./Icon";

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
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon />
        </div>
        <input
          type="text"
          id={inputId}
          className="block w-full max-w-[500px] rounded-md border border-base-300 px-xs py-xs pl-10 text-sm text-gray-900 outline-none transition-colors focus-within:bg-gray-50"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoComplete="off"
        />
      </div>
    </>
  );
};

export default SearchInput;
