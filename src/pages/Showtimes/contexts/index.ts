//Component này thiết lập một context tên là ShowtimeContext
//để quản lý trạng thái toàn cục liên quan đến vị trí và danh mục phim cho các suất chiếu.
import { createContext, useContext } from 'react' // Import các hàm từ React để tạo và sử dụng context

type ShowtimeContextType = {
  currentLocation: string // Trạng thái lưu trữ vị trí hiện tại
  handleCurrentLocation: (locationId: string) => void // Hàm để cập nhật vị trí hiện tại dựa trên locationId
  filterMovieByCategory: string // Trạng thái lưu trữ danh mục phim đang được chọn làm bộ lọc
  handleFilterMovieByCategory: (filterMovie: string) => void // Hàm để cập nhật danh mục phim được chọn
}

const ShowtimeContext = createContext<ShowtimeContextType>(
  {} as ShowtimeContextType
) // Tạo context với kiểu dữ liệu là ShowtimeContextType

ShowtimeContext.displayName = 'ShowtimeContext' // Đặt tên cho context để dễ dàng nhận biết khi debug

export const ShowtimeContextProvider = ShowtimeContext.Provider // Xuất context provider để có thể sử dụng ở các component khác

export const useShowTimeContext = () => useContext(ShowtimeContext) // Custom hook để dễ dàng truy cập và sử dụng context trong các component
