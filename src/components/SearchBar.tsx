import { useState, ChangeEvent, useEffect } from 'react';

interface SearchBarProps {
  initValue: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ initValue = '', onChange }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchQuery(newValue)
    onChange(newValue)
  }
  useEffect(() => {
    if (initValue !== '') {
      setSearchQuery(initValue)
    }
  }, [])
  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Type here to search jobs..."
      />
      <span>🔍</span>
    </div>
  )
}

export default SearchBar
