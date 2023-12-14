export interface BlogPost {
  id: number;
  title: string;
  author: string;
  date: string; // Bạn có thể sử dụng kiểu Date nếu lưu ngày làm việc với JavaScript Date Object
  thumb: string; // Đường dẫn đến hình ảnh thumbnail
  content: {
    para: string[];
    img: string;
  }[];
}

// Ví dụ cách sử dụng:
// const samplePost: BlogPost = {
//   id: 1,
//   title: "Tiêu đề bài viết",
//   author: "Tên tác giả",
//   date: "2023-01-01", // hoặc new Date("2023-01-01")
//   thumb: "/path/to/thumbnail.jpg",
//   content: "<p>Đây là nội dung <strong>HTML</strong> của bài viết.</p>",
// };
