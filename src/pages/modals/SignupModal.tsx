import { useState } from 'react' // Import useState để quản lý trạng thái của component
import { toast } from 'react-toastify' // Import toast để hiển thị thông báo cho người dùng
import 'react-toastify/dist/ReactToastify.css' // Import CSS của react-toastify
import BarLoader from 'react-spinners/BarLoader' // Import loader để hiển thị khi đang xử lý đăng ký
import { signup } from '@/api/auth' // Import hàm signup để gọi API đăng ký người dùng
import { useMutation } from '@tanstack/react-query' // Import useMutation để quản lý các yêu cầu API bất đồng bộ
import { useFormik } from 'formik' // Import useFormik từ formik để quản lý và xác thực form

// Định nghĩa kiểu cho các giá trị của form
interface FormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// Component SignupModal
export const SignupModal = () => {
  const [loading] = useState(false) // Khởi tạo trạng thái loading (hiện không sử dụng thay đổi)
  // const [passViewState, setPassViewState] = useState(false) // Trạng thái để ẩn/hiện mật khẩu
  const [showForm, setShowForm] = useState(true) // Trạng thái để ẩn/hiển thị form
  const [files] = useState<File[]>([]) // Trạng thái để lưu các file (avatar) người dùng tải lên

  // Hàm để ẩn/hiển thị form khi nhấn nút đóng hoặc mở form
  const handleShowForm = () => {
    setShowForm((prevShowForm) => !prevShowForm)
  }

  // Mutation để xử lý đăng ký người dùng
  const CreateUser = useMutation({
    mutationFn: async (user: any) => await signup(user), // Hàm để gọi API đăng ký với dữ liệu người dùng
    onSuccess() {
      // Hiển thị thông báo thành công nếu đăng ký thành công
      toast.success('Đăng ký thành công', {
        position: 'top-right'
      })
    },
    onError() {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra trong quá trình đăng ký
      toast.error('Đăng ký thất bại, kiểm tra lại thông tin của bạn')
    }
  })

  // Sử dụng formik để quản lý và xác thực dữ liệu form
  const formikValidate = useFormik<FormValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }, // Khởi tạo các giá trị ban đầu cho form

    validate: (values) => {
      // Hàm xác thực giá trị của form
      const errors: Partial<FormValues> = {}

      // Kiểm tra độ dài của tên, phải lớn hơn 6 ký tự
      if (!values.name || values.name.length <= 6) {
        errors.name = 'Phải chứa ít nhất 6 ký tự '
      }

      // Kiểm tra email có hợp lệ hay không
      if (!values.email) {
        errors.email = 'Yêu cầu email'
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = 'Yêu cầu email'
      }

      // Kiểm tra mật khẩu có được nhập và độ dài tối thiểu là 8 ký tự
      if (!values.password) {
        errors.password = 'Yêu cầu mật khẩu'
      } else if (values.password.length < 8) {
        errors.password = 'Mặt khẩu phải trên 8 ký tự'
      }

      // Kiểm tra xác nhận mật khẩu
      if (!values.confirmPassword) {
        errors.confirmPassword = 'Bắt buộc phải nhập lại mật khẩu'
      } else if (values.confirmPassword.length < 6) {
        errors.confirmPassword = 'Nhập lại mật khẩu phải lớn hơn 6 ký tự'
      } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = 'Mật khẩu không khớp, thử nhập lại'
      }

      return errors // Trả về các lỗi (nếu có)
    },
    onSubmit: async (values) => {
      // Hàm xử lý khi người dùng submit form
      const data = new FormData()
      data.set('name', values.name) // Thêm tên vào FormData
      data.set('email', values.email) // Thêm email vào FormData
      data.set('password', values.password) // Thêm mật khẩu vào FormData
      data.set('confirmPassword', values.confirmPassword) // Thêm xác nhận mật khẩu vào FormData

      // Nếu có file (avatar), thêm vào FormData, nếu không thì thêm avatar mặc định
      if (files.length > 0) {
        data.set('avatar', files[0])
      } else {
        data.set(
          'avatar',
          'https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-19.jpg'
        ) // Giá trị mặc định nếu không có file tải lên
      }

      try {
        // Gọi API đăng ký người dùng
        await CreateUser.mutateAsync(data)
        setShowForm(false) // Ẩn form sau khi đăng ký thành công
        resetFormik() // Reset form
      } catch (error: any) {
        throw new Error(error) // Ném lỗi nếu có lỗi xảy ra
      }
    }
  })

  // Hàm để ẩn/hiện mật khẩu khi người dùng nhấn vào nút
  const togglePassState = (e: any) => {
    e.preventDefault()
    setPassViewState((prevState) => !prevState)
  }

  // Hàm reset giá trị form về giá trị ban đầu
  const resetFormik = () => {
    formikValidate.resetForm({
      values: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    })
  }

  return (
    <div>
      {showForm && ( // Nếu showForm là true thì hiển thị form
        <div className="signup-form2 overflow-y-hidden mt-20">
          <div className="hide-scroll-bar" style={{ borderRadius: 'inherit' }}>
            <form
              onSubmit={formikValidate.handleSubmit} // Hàm xử lý submit form của formik
              encType="multipart/form-data"
            >
              <div className="signup-form-heading">
                <h2 className="signup-form-heading-text">
                  Tạo tài khoản DREAM CINEMA
                </h2>
                <button
                  type="button"
                  className="btn-form-exit"
                  onClick={handleShowForm} // Đóng form khi nhấn nút
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="form-icon"
                    viewBox="0 0 512 512"
                  >
                    {/* Icon đóng form */}
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                      d="M368 368L144 144M368 144L144 368"
                    />
                  </svg>
                </button>
              </div>

              <div className="signup-form-body">
                {/* Các trường nhập liệu cho tên, email, mật khẩu, và xác nhận mật khẩu */}
                <div className="signup-form-category">
                  <label>
                    Tên: <span>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên"
                    defaultValue={formikValidate.values.name}
                    onChange={formikValidate.handleChange}
                    onBlur={formikValidate.handleBlur}
                    name="name"
                  />
                </div>
                {formikValidate.touched.name && formikValidate.errors.name && (
                  <span className="text-red-500 text-base">
                    {formikValidate.errors.name}
                  </span>
                )}

                {/* Phần nhập email */}
                <div className="signup-form-category">
                  <label>
                    Email: <span>*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Nhập Email"
                    defaultValue={formikValidate.values.email}
                    onChange={formikValidate.handleChange}
                    onBlur={formikValidate.handleBlur}
                  />
                </div>
                {formikValidate.touched.email &&
                  formikValidate.errors.email && (
                    <div className="text-red-500 text-base">
                      {formikValidate.errors.email}
                    </div>
                  )}

                {/* Phần nhập mật khẩu */}
                <div className="signup-form-category">
                  <label>
                    Mật khẩu (Phải chứa ít nhất 8 chữ số): <span>*</span>
                  </label>
                  <div className="input-password">
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu của bạn"
                      defaultValue={formikValidate.values.password}
                      onChange={formikValidate.handleChange}
                      onBlur={formikValidate.handleBlur}
                      name="password"
                    />
                    <button
                      type="button"
                      className="pass-icon-btn"
                      onClick={(e) => togglePassState(e)} // Hiển thị/ẩn mật khẩu
                    >
                      {/* Icon ẩn/hiện mật khẩu */}
                    </button>
                  </div>
                </div>
                {formikValidate.touched.password &&
                  formikValidate.errors.password && (
                    <div className="text-red-500 text-base">
                      {formikValidate.errors.password}
                    </div>
                  )}

                {/* Phần xác nhận mật khẩu */}
                <div className="signup-form-category">
                  <label>
                    Xác nhận mật khẩu: <span>*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    defaultValue={formikValidate.values.confirmPassword}
                    onChange={formikValidate.handleChange}
                    onBlur={formikValidate.handleBlur}
                    name="confirmPassword"
                  />
                </div>
                {formikValidate.touched.confirmPassword &&
                  formikValidate.errors.confirmPassword && (
                    <div className="text-red-500 text-base">
                      {formikValidate.errors.confirmPassword}
                    </div>
                  )}

                {/* Nút đăng ký */}
                <button
                  type="submit"
                  className="btn-reg bg-[#eb3656]"
                  disabled={loading}
                >
                  {loading ? <BarLoader color="#e6e6e8" /> : 'Đăng ký'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
