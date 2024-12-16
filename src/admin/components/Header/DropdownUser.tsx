import { useContext, useEffect, useRef, useState } from 'react' // Import các hook cần thiết từ React
import { Link } from 'react-router-dom' // Import Link từ react-router-dom để điều hướng trong SPA
import { ContextMain } from '@/context/Context' // Import ContextMain để lấy thông tin người dùng

const DropdownUser = () => {
  const { userDetail } = useContext(ContextMain) // Truy xuất thông tin người dùng từ context
  const [dropdownOpen, setDropdownOpen] = useState(false) // State quản lý việc dropdown có mở hay không

  const trigger = useRef<any>(null) // Ref để tham chiếu đến nút kích hoạt dropdown
  const dropdown = useRef<any>(null) // Ref để tham chiếu đến phần tử dropdown

  // Đóng dropdown khi nhấp ra ngoài
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return // Nếu dropdown chưa được gắn vào DOM, kết thúc hàm
      if (
        !dropdownOpen || // Nếu dropdown đã đóng thì không làm gì thêm
        dropdown.current.contains(target) || // Nếu nhấp vào bên trong dropdown, không đóng
        trigger.current.contains(target) // Nếu nhấp vào nút kích hoạt, không đóng
      )
        return
      setDropdownOpen(false) // Nếu nhấp ra ngoài dropdown, đóng dropdown
    }
    document.addEventListener('click', clickHandler) // Thêm event listener cho sự kiện click
    return () => document.removeEventListener('click', clickHandler) // Dọn dẹp event listener khi component unmount
  })

  // Đóng dropdown khi nhấn phím Esc
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return // Nếu dropdown đóng hoặc phím không phải Esc, kết thúc hàm
      setDropdownOpen(false) // Nếu nhấn phím Esc, đóng dropdown
    }
    document.addEventListener('keydown', keyHandler) // Thêm event listener cho sự kiện nhấn phím
    return () => document.removeEventListener('keydown', keyHandler) // Dọn dẹp event listener khi component unmount
  })

  return (
    <div className="relative">
      {' '}
      {/* Đóng gói dropdown bên trong một container */}
      <Link
        ref={trigger} // Tham chiếu đến phần tử nút kích hoạt dropdown
        onClick={() => setDropdownOpen(!dropdownOpen)} // Đổi trạng thái mở/đóng khi nhấn vào nút
        className="flex items-center gap-4" // Đặt lớp CSS để căn giữa các thành phần trong nút
        to="#"
      >
        <span className="hidden text-right lg:block ">
          {' '}
          {/* Hiển thị tên người dùng trên màn hình lớn */}
          <span className="block text-base font-medium text-black dark:text-white max-w-25 line-clamp-1 text-ellipsis truncate">
            {userDetail?.message?.name}{' '}
            {/* Hiển thị tên người dùng từ context */}
          </span>
        </span>

        <span>
          <img
            src={userDetail?.message?.avatar} // Hiển thị ảnh đại diện người dùng
            alt="User" // Văn bản thay thế cho ảnh đại diện
            className="h-12 w-12 rounded-full" // Thiết lập kích thước và kiểu bo tròn cho ảnh
          />
        </span>

        <svg // Biểu tượng mũi tên cho dropdown
          className="hidden fill-current sm:block" // Chỉ hiện trên màn hình vừa và lớn
          width="12" // Chiều rộng của biểu tượng
          height="8" // Chiều cao của biểu tượng
          viewBox="0 0 12 8" // Kích thước viewBox để định hình biểu tượng
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd" // Quy tắc điền đầy cho hình SVG
            clipRule="evenodd" // Quy tắc cắt bớt cho hình SVG
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill="" // Màu sắc của biểu tượng, có thể được điều chỉnh qua CSS
          />
        </svg>
      </Link>
      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown} // Tham chiếu đến phần tử dropdown
        className={`absolute right-0 mt-4 flex w-[220px] flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen ? 'block' : 'hidden'}`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <li className="py-4">
            <Link
              to="/admin/settings" // Đường dẫn đến trang cài đặt tài khoản
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out text-black dark:text-white lg:text-base"
            >
              <svg // Biểu tượng cài đặt
                className="fill-current"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="..." fill="" /> {/* Đường dẫn của biểu tượng SVG */}
              </svg>
              Cài đặt tài khoản{' '}
              {/* Văn bản hiển thị cho tùy chọn cài đặt tài khoản */}
            </Link>
          </li>
        </ul>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  )
}

export default DropdownUser // Xuất component DropdownUser để sử dụng ở nơi khác
