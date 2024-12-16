import { ChangeEventHandler, MouseEventHandler, useState } from 'react'
import './search.css' // Import file CSS cho SearchBar
import { Loader2 } from 'lucide-react' // Icon Loader để hiển thị trạng thái loading
import { X } from 'lucide-react' // Icon X để đóng tìm kiếm
import DropdownSearchItem from './DropdownSearchItem' // Thành phần hiển thị kết quả tìm kiếm
import useDebounceCustom from '@/hooks/useDebounceCustom' // Hook tùy chỉnh để debounce tìm kiếm
import TooltipComponent from '../TooltipComponent' // Thành phần hiển thị tooltip cho các nút

function SearchBar() {
  const [showSearch, setShowSearch] = useState<boolean>(false) // Trạng thái điều khiển thanh tìm kiếm (hiện/ẩn)

  // Sử dụng custom hook để debounce tìm kiếm
  const [
    results, // Kết quả tìm kiếm
    isSearching, // Trạng thái tìm kiếm (đang tìm kiếm hay không)
    searchTerm, // Từ khóa người dùng nhập
    setSearchTerm, // Hàm để cập nhật từ khóa tìm kiếm
    setResults, // Hàm để cập nhật kết quả tìm kiếm
    setIsSearching // Hàm để cập nhật trạng thái đang tìm kiếm
  ] = useDebounceCustom()

  // Hàm xử lý sự kiện click trên thanh tìm kiếm
  const handleClick: MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    const target = event.target as HTMLDivElement
    // Nếu người dùng nhấn vào nút tìm kiếm hoặc phần tử con của nó
    if (
      target.classList.contains('search__button') ||
      target.closest('.search__button')
    ) {
      setShowSearch(!showSearch) // Chuyển đổi giữa hiện/ẩn thanh tìm kiếm
      if (showSearch) {
        setResults([]) // Xóa kết quả tìm kiếm nếu thanh tìm kiếm được đóng
        setSearchTerm('') // Xóa từ khóa tìm kiếm
      }
    }
  }

  // Hàm để đóng thanh tìm kiếm và xóa từ khóa
  const handleCloseSearch = () => {
    setShowSearch(false) // Đóng thanh tìm kiếm
    setSearchTerm('') // Xóa từ khóa
  }

  // Tạo lớp phủ (overlay) khi thanh tìm kiếm được mở
  const overlay =
    "after:content-[''] after:absolute after:top-[-15%] after:left-[-75vw] after:z-[10] after:opacity-60 after:bg-black after:w-[200vw] after:h-screen"

  // Hàm xử lý sự kiện khi người dùng nhập từ khóa vào thanh tìm kiếm
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e): void => {
    const target = e.target as HTMLInputElement
    setSearchTerm(target.value) // Cập nhật từ khóa tìm kiếm
    setIsSearching(true) // Bật trạng thái tìm kiếm
  }

  return (
    <div
      className={`absolute top-[-23px] bg-background-secondary w-full ${showSearch ? 'show-search-bg ' + overlay : ''} `}
    >
      <div
        onClick={handleClick} // Xử lý khi người dùng nhấn vào thanh tìm kiếm
        className={`search z-50 ${showSearch ? 'show-search bg-white' : ''}`}
        id="search-bar"
      >
        {/* Input để nhập từ khóa tìm kiếm */}
        <input
          type="text"
          placeholder="Gõ cái gì đó..." // Placeholder khi chưa nhập gì
          name="q"
          autoComplete="off"
          value={searchTerm} // Giá trị của input là từ khóa tìm kiếm
          onChange={handleChange} // Xử lý sự kiện khi người dùng nhập liệu
          className="search__input text-2xl bg-transparent text-background-main "
        />

        {/* Nút đóng hoặc biểu tượng loading */}
        <div className="absolute right-24 top-7 ">
          {isSearching ? (
            <Loader2 size={15} className="animate-spin text-background-main" /> // Hiển thị biểu tượng loading khi đang tìm kiếm
          ) : (
            <X
              className={`hover:cursor-pointer text-background-main ${showSearch ? 'block' : 'hidden'}`} // Hiển thị biểu tượng đóng khi tìm kiếm mở
              size={15}
            />
          )}
        </div>

        {/* Nút tìm kiếm */}
        <TooltipComponent tooltip={'Search'}>
          <div
            className="search__button bg-primary-movieColor"
            id="search-button"
          >
            <i className="ri-search-2-line search__icon"></i>{' '}
            {/* Icon tìm kiếm */}
            <i className="ri-close-line search__close"></i> {/* Icon đóng */}
          </div>
        </TooltipComponent>

        {/* Hiển thị kết quả tìm kiếm nếu có từ khóa */}
        {searchTerm !== '' && (
          <DropdownSearchItem
            results={results} // Kết quả tìm kiếm
            isSearching={isSearching} // Trạng thái đang tìm kiếm
            searchTerm={searchTerm} // Từ khóa tìm kiếm
            handleCloseSearch={handleCloseSearch} // Đóng thanh tìm kiếm khi chọn kết quả
          />
        )}
      </div>
    </div>
  )
}

export default SearchBar
