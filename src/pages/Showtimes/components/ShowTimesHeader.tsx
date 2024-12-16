// import { LocationSelector } from '../../../components/LocationSelector' // Import component để chọn vị trí (đã bị comment)
// import { useShowTimeContext } from '../contexts' // Import context để lấy hàm xử lý vị trí hiện tại (đã bị comment)
import { CategorySelector } from './CategorySelector' // Import component CategorySelector để người dùng chọn danh mục

export const ShowTimesHeader = () => {
  // const { handleCurrentLocation } = useShowTimeContext() // Lấy hàm handleCurrentLocation từ context (đã bị comment)
  return (
    <section className="showtimes-header container ">
      {/* <LocationSelector handleCurrentLocation={handleCurrentLocation} /> */}{' '}
      {/* Component để chọn vị trí đã bị comment */}
      <CategorySelector cls="mt-32" />{' '}
      {/* Hiển thị CategorySelector với class bổ sung 'mt-32' để điều chỉnh khoảng cách */}
    </section>
  )
}
