import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import SearchBar from './SearchBar/SearchBar'
import { useContext, useState } from 'react'
import { SignupModal } from '@/pages/modals/SignupModal'
import { ContextAuth, ContextMain } from '@/context/Context'
import { LoginModal } from '@/pages/modals/LoginModal'
import DropDownMenu from './DropDownMenu'
// import { Bell } from 'lucide-react'
import { Separator } from './ui/separator'
// import TooltipComponent from './TooltipComponent'

// Thành phần Navbar nhận prop `setMenuState`, là một hàm để cập nhật trạng thái menu
export const Navbar = ({
  setMenuState
}: {
  // Hàm này thay đổi trạng thái của menu (bật/tắt)
  setMenuState: (state: (prevState: boolean) => boolean) => boolean
}) => {
  // Quản lý các state của component
  const [showSignup, setShowSignup] = useState(false) // Điều khiển việc hiển thị modal Đăng Ký
  const [showSignIn, setShowSignIn] = useState(false) // Điều khiển việc hiển thị modal Đăng Nhập
  const [showNav, setShowNav] = useState(false) // Điều khiển việc hiển thị menu điều hướng

  // Lấy thông tin xác thực từ Context (người dùng đã đăng nhập hay chưa)
  const { isLogined } = useContext<ContextAuth>(ContextMain)

  // Hàm để bật/tắt modal Đăng Ký
  const toggleShowForm = () => {
    setShowSignup((pre) => !pre) // Đảo ngược trạng thái showSignup (bật/tắt)
    setShowSignIn(false) // Đảm bảo modal Đăng Nhập bị tắt khi bật modal Đăng Ký
  }

  // Hàm bật/tắt hiển thị menu điều hướng (cho mobile hoặc khi chưa đăng nhập)
  const toggleShowNav = () => {
    setShowNav((pre) => !pre) // Đảo ngược trạng thái showNav (bật/tắt)
  }

  // Hàm để bật/tắt modal Đăng Nhập
  const toggleShowFormSignIn = () => {
    setShowSignIn((pre) => !pre) // Đảo ngược trạng thái showSignIn (bật/tắt)
    setShowSignup(false) // Đảm bảo modal Đăng Ký bị tắt khi bật modal Đăng Nhập
  }

  return (
    <div className="modal">
      <header>
        <div>
          {/* Nút bấm để mở menu điều hướng (cho mobile) */}
          <button
            className="btn-menu "
            onClick={() => setMenuState((prevState: boolean) => !prevState)} // Bật/tắt menu
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="menu-icon"
              viewBox="0 0 512 512"
            >
              {/* Icon menu dạng hamburger (3 đường ngang) */}
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="32"
                d="M80 160h352M80 256h352M80 352h352"
              />
            </svg>
          </button>

          {/* Logo của trang web, sử dụng `HashLink` để điều hướng đến phần đầu trang */}
          <HashLink className="logo-container" to="#headerTop">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="main-logo-icon"
              viewBox="0 0 512 512"
            >
              {/* Icon logo */}
              <path
                d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
                fill="none"
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeWidth="32"
              />
              {/* Đường viền cho logo */}
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M360 94.59V296M443.13 212.87L296 360M417.41 360H216M299.13 443.13l-144-144M152 416V216M68.87 299.13l144-144M94.59 152H288M212.87 68.87L360 216"
              />
            </svg>
            <h1 className="logo-text ">Dream Cinema</h1> {/* Tên của trang */}
          </HashLink>
        </div>

        {/* Menu điều hướng chính */}
        <nav>
          <ul className="nav-items">
            <li>
              <Link className="nav-item" to="/">
                Trang chủ
              </Link>{' '}
              {/* Link đến trang chủ */}
            </li>
            <li>
              <Link className="nav-item" to="/showtimes">
                Lịch chiếu
              </Link>{' '}
              {/* Link đến trang lịch chiếu */}
            </li>
            <li>
              <Link className="nav-item" to="/movies">
                Phim
              </Link>{' '}
              {/* Link đến trang phim */}
            </li>
            <li>
              <Link className="nav-item" to="/policy">
                Quy định
              </Link>{' '}
              {/* Link đến trang quy định */}
            </li>

            <li className="relative">
              <SearchBar /> {/* Thanh tìm kiếm */}
            </li>
          </ul>
        </nav>

        {/* Phần đăng ký/đăng nhập hoặc menu thả xuống khi đã đăng nhập */}
        <div className="nav-signup">
          <Separator
            className="bg-border-borderSocialLink h-9 ms-8 mr-4"
            orientation="vertical" // Đường phân cách giữa các thành phần
          />
          {isLogined ? (
            <>
              <DropDownMenu />{' '}
              {/* Menu thả xuống khi người dùng đã đăng nhập */}
            </>
          ) : (
            <>
              {/* Nút bấm để hiện modal Đăng Ký và Đăng Nhập */}
              <button className="customer-profile-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="profile-icon"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M344 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="32"
                  />
                  {/* Icon người dùng */}
                  <path
                    d="M256 304c-87 0-175.3 48-191.64 138.6C62.39 453.52 68.57 464 80 464h352c11.44 0 17.62-10.48 15.65-21.4C431.3 352 343 304 256 304z"
                    fill="none"
                    stroke="currentColor"
                    strokeMiterlimit="10"
                    strokeWidth="32"
                  />
                </svg>
              </button>
              <div>
                <button className="btn-signup-arrow" onClick={toggleShowNav}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="signup-icon"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="48"
                      d="M112 184l144 144 144-144"
                    />
                  </svg>
                </button>

                {/* Hiển thị các nút Đăng Ký và Đăng Nhập khi showNav = true */}
                {showNav && (
                  <div className="signup-options md:block hidden">
                    <ul className="signup-buttons">
                      <li>
                        <button
                          className="signup-button"
                          onClick={toggleShowForm}
                        >
                          Đăng Ký
                        </button>
                      </li>
                      <li>
                        <button
                          className="login-button"
                          onClick={toggleShowFormSignIn}
                        >
                          Đăng Nhập
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Hiển thị modal Đăng Ký nếu showSignup = true */}
      {showSignup && <SignupModal />}

      {/* Hiển thị modal Đăng Nhập nếu showSignIn = true */}
      {showSignIn && <LoginModal />}
    </div>
  )
}
