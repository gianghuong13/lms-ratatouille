import CourseSquare from "../../components/CourseSquare";
const courses = [
  {
    title: "Data Mining",
    image: "/path/to/your/image.png", // Thay bằng link ảnh thực tế
    description: "Khai phá dữ liệu (2425I_INT...)",
    code: "2425I_INT3209_9",
    semester: "Học kì I",
    year: "2024 - 2025",
  },
  // Thêm nhiều khóa học khác ở đây
];

const generateCourseTiles = (courses) => {
  return courses.map((course) => (
    <div key={course.id} className="p-4">
      <CourseSquare
        image2={course.image}
        frame17={course.frameIcon}
        className="w-full"
      />
    </div>
  ));
};

const AllCoursesPage = ({ className = "" }) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-whitesmoke-100 ${className}`}
    >
      {generateCourseTiles(courses)}
    </div>
  );
};

export default AllCoursesPage;