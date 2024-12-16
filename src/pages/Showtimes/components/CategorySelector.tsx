import { useSearchParams } from 'react-router-dom' // Import hook từ react-router-dom để thao tác với tham số trên URL
import HashLoader from 'react-spinners/HashLoader' // Import component loader từ react-spinners để hiển thị khi dữ liệu đang tải
import { useAllCategory } from '../hooks' // Import custom hook để lấy dữ liệu tất cả các danh mục từ API
import { useShowTimeContext } from '../contexts' // Import context để sử dụng các hàm xử lý và state toàn cục liên quan đến danh mục

export const CategorySelector = ({ cls }: { cls?: string }) => {
  // Khai báo component CategorySelector với prop tùy chọn 'cls' cho className
  const { handleFilterMovieByCategory } = useShowTimeContext() // Lấy hàm handleFilterMovieByCategory từ context để xử lý việc lọc phim

  const [searchParams, setSearchParams] = useSearchParams() // Khởi tạo state để lấy và cập nhật tham số URL (category)
  const userCategory = searchParams.get('category') || 'All' // Lấy giá trị của tham số 'category' từ URL, nếu không có thì mặc định là 'All'

  const { data: categoryData, isLoading } = useAllCategory() // Gọi API để lấy dữ liệu danh mục, trả về data và trạng thái isLoading

  const handleSelectedCategoryId = (cate: {
    _id: string
    name: string
    products: []
  }) => {
    // Hàm xử lý khi người dùng chọn một danh mục
    setSearchParams({ category: cate.name }) // Cập nhật URL với giá trị category mới
    handleFilterMovieByCategory(cate._id) // Gọi hàm để cập nhật phim theo danh mục được chọn
  }

  if (isLoading) {
    // Kiểm tra nếu dữ liệu đang được tải
    return (
      <HashLoader
        cssOverride={{ display: 'block', margin: '4.8rem auto' }} // Tùy chỉnh CSS cho loader để căn giữa
        color="#eb3656" // Màu của loader
      />
    )
  }

  const checkedColor = (val: string) => {
    // Hàm xác định màu nền và viền dựa trên việc danh mục có phải là danh mục đang chọn hay không
    return {
      backgroundColor: val === userCategory ? '#ef5e78' : '', // Nếu là danh mục hiện tại thì đổi màu nền
      border: val === userCategory ? '2px solid transparent' : '' // Nếu là danh mục hiện tại thì đổi viền
    }
  }

  const renderCategory = () => {
    // Hàm render danh sách các danh mục
    return categoryData?.map(
      (cate: { _id: string; name: string; products: [] }, idx: number) => {
        // Lặp qua danh sách danh mục
        return (
          <div
            className="genre-input-container shadow-md" // ClassName để định dạng cho từng mục
            key={idx} // Khóa duy nhất cho mỗi mục trong danh sách
            style={checkedColor(cate.name)} // Áp dụng style dựa trên hàm checkedColor
          >
            <input
              type="radio" // Input dạng radio để chọn danh mục
              name="Select Category" // Tên của nhóm radio
              value={cate.name} // Giá trị là tên của danh mục
              onChange={() => handleSelectedCategoryId(cate)} // Gọi hàm khi giá trị thay đổi
              checked={cate.name === userCategory} // Kiểm tra nếu danh mục này là danh mục hiện tại
            />

            <label
              className="form-genre-detail text-primary-nameMovie font-semibold dark:font-normal" // ClassName để định dạng cho label
              htmlFor={cate.name} // Liên kết label với input qua thuộc tính htmlFor
            >
              {cate.name}
            </label>
          </div>
        )
      }
    )
  }

  return (
    <div className={`genre-container ${cls}`}>
      {' '}
      {/* Container chính cho component, thêm className từ prop cls */}
      <div className="genre-icon-container">
        {' '}
        {/* Container cho icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg" // Định nghĩa namespace SVG
          className="genre-icon" // ClassName để định dạng icon
          viewBox="0 0 512 512" // Kích thước viewBox của SVG
        >
          <path
            d="M35.4 87.12l168.65 196.44A16.07 16.07 0 01208 294v119.32a7.93 7.93 0 005.39 7.59l80.15 26.67A7.94 7.94 0 00304 440V294a16.07 16.07 0 014-10.44L476.6 87.12A14 14 0 00466 64H46.05A14 14 0 0035.4 87.12z" // Đường path của icon SVG
            fill="none" // Không có màu nền
            stroke="currentColor" // Màu viền dựa trên màu hiện tại
            strokeLinecap="round" // Kiểu kết thúc của đường viền là bo tròn
            strokeLinejoin="round" // Kiểu kết nối giữa các đường là bo tròn
            strokeWidth="32" // Độ dày của đường viền
          />
        </svg>
      </div>
      {renderCategory()}{' '}
      {/* Gọi hàm render danh mục để hiển thị danh sách các danh mục */}
    </div>
  )
}
