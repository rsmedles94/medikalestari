"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

interface SearchModalContextType {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

const SearchModalContext = createContext<SearchModalContextType | undefined>(
  undefined,
);

export const SearchModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      isSearchOpen,
      openSearch,
      closeSearch,
      toggleSearch,
    }),
    [isSearchOpen, openSearch, closeSearch, toggleSearch],
  );

  return (
    <SearchModalContext.Provider value={value}>
      {children}
    </SearchModalContext.Provider>
  );
};

export const useSearchModal = () => {
  const context = useContext(SearchModalContext);
  if (context === undefined) {
    throw new Error("useSearchModal must be used within SearchModalProvider");
  }
  return context;
};
