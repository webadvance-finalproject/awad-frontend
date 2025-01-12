import PropTypes from 'prop-types';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const TrailerList = ({ trailers, totalPages, page, onPageChange }) => {
  return (
    <Stack
      spacing={2}
    >
      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-between"

      >
        {trailers.map((trailer) => (
          <div
            key={trailer.id}
            style={{
              width: "100%", // Chiếm toàn bộ chiều rộng bố cục Stack
              maxWidth: "400px", // Giới hạn tối đa kích thước khung
              aspectRatio: "16 / 9", // Duy trì tỷ lệ khung hình 16:9
            }}
          >
            <iframe
              style={{
                width: "100%", // Đảm bảo iframe chiếm toàn bộ kích thước của thẻ cha
                height: "100%",
                border: "none", // Loại bỏ đường viền (tùy chỉnh)
              }}
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </Stack>
      <Stack direction="row" justifyContent="flex-end">
        <Pagination
          count={totalPages}
          page={page}
          onChange={onPageChange}
          color="primary"
        />
      </Stack>
    </Stack>
  );
};

TrailerList.propTypes = {
  trailers: PropTypes.array.isRequired,
  totalPages: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default TrailerList;
