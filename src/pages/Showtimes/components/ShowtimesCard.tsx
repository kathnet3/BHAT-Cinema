import { getOneMovie } from '@/api/movie' // Import hàm để lấy thông tin chi tiết của một bộ phim từ API

import { Button } from '@/components/ui/button' // Import component Button từ thư mục UI để sử dụng cho các nút
import { ShowTime } from '@/pages/MovieDetails/components/MovieInfoSection' // Import kiểu dữ liệu ShowTime từ trang MovieDetails
import {
  chuyenDoiNgay,
  convertAmPm,
  formatDateToISOString,
  getDay,
  getHourAndMinute,
  selectCalendar
} from '@/utils' // Import các hàm tiện ích để xử lý thời gian và ngày tháng
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog' // Import các thành phần của AlertDialog từ UI components để hiển thị các hộp thoại cảnh báo
import { AVAILABLE, MOVIE_DETAIL } from '@/utils/constant' // Import các hằng số từ utils để sử dụng
import { useQuery } from '@tanstack/react-query' // Import hook useQuery từ react-query để lấy và quản lý dữ liệu từ API
import { useNavigate } from 'react-router-dom' // Import hook useNavigate từ react-router-dom để điều hướng trong ứng dụng
import HashLoader from 'react-spinners/HashLoader' // Import loader để hiển thị trạng thái tải dữ liệu

type ShowtimesCardProps = {
  movieId: string
  currentDay: Date
} // Định nghĩa kiểu cho các props của component

export const ShowtimesCard = ({ movieId, currentDay }: ShowtimesCardProps) => {
  // Khai báo component ShowtimesCard
  const navigate = useNavigate() // Khởi tạo hàm điều hướng để sử dụng trong component

  const { data: dataMovie, isLoading } = useQuery({
    // Sử dụng useQuery để gọi API lấy thông tin phim
    queryKey: [MOVIE_DETAIL, movieId], // Đặt key cho query để nhận dạng dữ liệu
    queryFn: () => getOneMovie(movieId) // Hàm để gọi API và lấy thông tin chi tiết của phim dựa trên movieId
  })

  const override = {
    // Cấu hình CSS cho loader
    display: 'block',
    margin: '4.8rem auto'
  }
  if (isLoading) {
    // Nếu dữ liệu đang được tải
    return <HashLoader cssOverride={override} size={60} color="#eb3656" /> // Hiển thị loader
  }

  const showTimePerDay =
    dataMovie?.showTimeCol &&
    dataMovie?.showTimeCol
      ?.map((showTime: ShowTime) => {
        // Duyệt qua từng showTime trong dữ liệu showTimeCol
        if (
          getDay(showTime.timeFrom) == getDay(selectCalendar(currentDay)) && // Kiểm tra nếu ngày của showTime trùng với currentDay
          showTime.status === AVAILABLE // Kiểm tra nếu trạng thái của showTime là AVAILABLE
        ) {
          return showTime // Trả về showTime nếu thỏa mãn
        }
      })
      .filter(function (element: ShowTime) {
        // Lọc bỏ các phần tử undefined trong mảng
        return element !== undefined
      })

  return (
    // Phần hiển thị JSX của component
    <div className="showtimes-card">
      <div className="showtimes-card-leftpart">
        <div className="showtimes-img-box">
          <img
            className="showtimes-img"
            src={dataMovie.image} // Hiển thị hình ảnh của phim
            alt={dataMovie.name} // Alt text là tên của phim
          />
        </div>
        <h2 className="showtimes-title">{dataMovie.name}</h2>{' '}
        {/*hiện tiêu đề phim */}
        <button
          className="showtimes-details-btn"
          onClick={() => navigate(`/movie/${dataMovie.slug}`)} // Điều hướng tới trang chi tiết phim khi nhấn nút
        >
          Xem chi tiết
        </button>
      </div>

      <div className="showtimes-screen-container">
        <div className="bg-background-main shadow-lg text-primary-movieColor text-3xl flex w-full justify-center py-6 font-semibold">
          {chuyenDoiNgay(currentDay)}{' '}
          {/* // Hiển thị ngày được chọn theo định dạng*/}
        </div>
        {!dataMovie.showTimeCol || dataMovie.showTimeCol.length > 0 ? ( // Kiểm tra nếu có dữ liệu showTimeCol
          <div className="showtimes-schedule-container my-10 gap-y-8">
            {showTimePerDay.map(
              (showTime: { timeFrom: string; _id: string }) => {
                // Duyệt qua từng showTime
                return (
                  <AlertDialog key={showTime._id}>
                    <AlertDialogTrigger asChild>
                      <Button
                        key={showTime._id}
                        className="text-2xl font-semibold py-4 px-14 rounded-full border-2 bg-transparent"
                        variant={'outline'}
                      >
                        {convertAmPm(getHourAndMinute(showTime.timeFrom))}{' '}
                        {/* //
                        Hiển thị giờ chiếu đã chuyển đổi sang định dạng AM/PM*/}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-3xl mb-4 mt-2">
                          {new Date().toISOString() <
                          formatDateToISOString(showTime.timeFrom)
                            ? 'Xác nhận mua vé?'
                            : 'Đã quá giờ chiếu'}{' '}
                          {/* // Kiểm tra nếu thời gian hiện tại trước thời gian
                          chiếu thì hiển thị xác nhận mua vé, nếu không thì hiển
                          thị đã quá giờ */}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-2xl">
                          {new Date().toISOString() <
                          formatDateToISOString(showTime.timeFrom)
                            ? `Phim này chỉ dành cho trẻ em trên ${dataMovie?.age_limit || '10'} tuổi. Vui lòng cân nhắc khi mua vé. BQL Rạp sẽ phải từ chối cho vào nếu sai quy định.`
                            : 'Đã quá thời gian chọn suất chiếu này. Vui lòng chọn suất chiếu khác'}{' '}
                          {/*   // Thông báo tùy vào thời gian hiện tại so với giờ
                          chiếu*/}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="text-2xl px-9 py-3">
                          Hủy
                        </AlertDialogCancel>
                        {new Date().toISOString() <
                          formatDateToISOString(showTime.timeFrom) && (
                          <AlertDialogAction
                            onClick={() => {
                              navigate('/movie/' + dataMovie?.slug) // Điều hướng đến trang chi tiết phim nếu tiếp tục
                            }}
                            className="bg-primary-movieColor text-2xl px-9 py-3"
                          >
                            Tiếp tục
                          </AlertDialogAction>
                        )}
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )
              }
            )}
          </div>
        ) : (
          <div className="h-full text-3xl flex items-center justify-center w-full">
            Không có giờ chiếu
          </div> // Hiển thị thông báo nếu không có suất chiếu nào
        )}
      </div>
    </div>
  )
}
