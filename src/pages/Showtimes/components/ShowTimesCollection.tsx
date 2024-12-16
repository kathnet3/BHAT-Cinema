import { getAllHasShow } from '@/api/movie' // Import hàm để lấy thông tin về các phim có suất chiếu từ API
import { useQuery } from '@tanstack/react-query' // Import useQuery từ react-query để quản lý việc gọi API và caching
import HashLoader from 'react-spinners/HashLoader' // Import loader để hiển thị trạng thái tải dữ liệu
import { useShowTimeContext } from '../contexts' // Import context để lấy dữ liệu liên quan đến bộ lọc phim theo danh mục
import { ShowtimesCard } from './ShowtimesCard' // Import component ShowtimesCard để hiển thị thông tin về suất chiếu của từng phim
import { Button } from '@/components/ui/button' // Import Button component để sử dụng các nút
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select' // Import các thành phần cho dropdown Select
import { useState } from 'react' // Import useState để quản lý state
import { chuyenDoiNgay } from '@/utils' // Import hàm tiện ích để chuyển đổi định dạng ngày

const days = [
  {
    day: '4 ngày',
    value: '4'
  },
  {
    day: '8 ngày',
    value: '8'
  },
  {
    day: '10 ngày',
    value: '10'
  }
] // Danh sách số ngày cho dropdown chọn số ngày

export const ShowTimesCollection = () => {
  const { filterMovieByCategory } = useShowTimeContext() // Lấy dữ liệu filter từ context
  const [daySelect, setDaySelect] = useState({
    daySelected: '4',
    currentDay: new Date()
  }) // State để quản lý ngày được chọn và số ngày hiển thị

  const { data: dataMovies, isLoading } = useQuery({
    queryKey: ['ALL_MOVIES', filterMovieByCategory], // Khóa query để nhận dạng dữ liệu
    queryFn: () => getAllHasShow(filterMovieByCategory) // Hàm gọi API lấy danh sách phim theo danh mục
  })

  if (isLoading) {
    return (
      <HashLoader
        cssOverride={{ display: 'block', margin: '4.8rem auto' }} // Căn giữa loader khi đang tải
        color="#eb3656"
      />
    )
  }

  const nextDay = [...Array(parseFloat(daySelect.daySelected))].map(
    (_, i) => new Date(Date.now() + i * 86400000) // Tạo mảng các ngày tiếp theo dựa vào số ngày được chọn
  )

  const listDataMovieId =
    dataMovies?.map((movie: { _id: string }) => movie._id) || [] // Lấy danh sách các movieId từ dữ liệu trả về

  const handleSelectCurrentDay = (day: Date) => {
    setDaySelect((prev) => {
      return {
        ...prev,
        currentDay: day // Cập nhật ngày hiện tại được chọn
      }
    })
  }

  const handleChangeValue = (value: string) => {
    setDaySelect((prev) => {
      return {
        ...prev,
        daySelected: value // Cập nhật số ngày được chọn từ dropdown
      }
    })
  }

  // Lần đầu map dựa vào danh sách phim, nếu filter theo category thì map theo id
  return (
    <section className="section-showtimes">
      <div className="showtimes-collection container">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 basis-4/5 flex-wrap">
            {nextDay.map((day, index: number) => (
              <Button
                key={index}
                variant={'outline'}
                className={`py-4 border-2 px-5 rounded-full font-semibold ${day.getDate() === daySelect.currentDay.getDate() ? 'bg-primary-movieColor' : 'bg-transparent'}`}
                onClick={() => handleSelectCurrentDay(day)} // Chọn ngày khi người dùng nhấn vào nút
              >
                {chuyenDoiNgay(day)} {/* Hiển thị ngày đã chuyển đổi */}
              </Button>
            ))}
          </div>
          <div className="basis-1/5 flex justify-end">
            <Select onValueChange={handleChangeValue}>
              {' '}
              {/* Dropdown để chọn số ngày */}
              <SelectTrigger
                className={`w-[110px] bg-transparent rounded-full text-xl font-semibold py-4 flex px-6 border-2 border-primary-movieColor`}
              >
                <SelectValue placeholder="Chọn ngày" />{' '}
                {/* Placeholder của dropdown */}
              </SelectTrigger>
              <SelectContent className="bg-background-main p-2 border-primary-movieColor">
                <SelectGroup>
                  {days.map((day, index) => (
                    <SelectItem
                      key={index}
                      value={day.value}
                      className={`bg-background-secondary my-2 text-2xl text-primary-movieColor py-3 rounded-md focus:bg-accent focus:text-accent-foreground ${daySelect.daySelected === day.value ? 'bg-accent text-accent-foreground' : ''}`}
                    >
                      {day.day} {/* Hiển thị số ngày */}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        {listDataMovieId.length > 0 ? (
          listDataMovieId.map((movieId: string, index: number) => (
            <ShowtimesCard
              key={index}
              movieId={movieId}
              currentDay={daySelect.currentDay} // Truyền movieId và currentDay cho ShowtimesCard
            />
          ))
        ) : (
          <div className="h-full text-3xl flex items-center justify-center w-full">
            Không tìm thấy
          </div>
        )}{' '}
        {/* Thông báo nếu không có phim nào */}
      </div>
    </section>
  )
}
