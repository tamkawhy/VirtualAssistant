# AI Virtual Assistant

## Tổng quan dự án
Trợ lý ảo AI cá nhân hóa là một ứng dụng web được xây dựng với **MERN Stack** (MongoDB, Express, React, Node.js), tích hợp công nghệ AI để cung cấp trải nghiệm tương tác tự nhiên và tùy chỉnh cho người dùng.  
Ứng dụng cho phép người dùng thực hiện các tác vụ như nhận diện giọng nói liên tục, phản hồi thông minh, tìm kiếm thông tin, kiểm tra thời gian, mở ứng dụng và lưu trữ lịch sử tương tác.

---

## Công nghệ sử dụng

### Backend
- **Express.js:** Xây dựng API backend.
- **Mongoose:** Quản lý cơ sở dữ liệu MongoDB.
- **MongoDB Atlas:** Lưu trữ dữ liệu trực tuyến.
- **JWT** & **bcrypt:** Xác thực và mã hóa thông tin người dùng.
- **Cloudinary:** Tải lên và lưu trữ hình ảnh.
- **Multer:** Quản lý file upload.
- **CORS:** Xử lý chia sẻ tài nguyên giữa frontend và backend.

### Frontend
- **React.js:** Xây dựng giao diện người dùng.
- **Vite:** Tăng tốc độ phát triển frontend.
- **Tailwind CSS:** Thiết kế giao diện hiện đại.
- **React Router DOM:** Định tuyến trong ứng dụng.
- **Axios:** Gửi yêu cầu API.
- **React Icons:** Thêm biểu tượng UI.
- **Context API:** Quản lý trạng thái ứng dụng.

### AI và Tích hợp
- **Google Gemini API:** Xử lý ngôn ngữ tự nhiên và phản hồi thông minh.
- **Web Speech API:** Nhận diện và tổng hợp giọng nói.

---

## Tính năng chính

- **Đăng ký và đăng nhập:** Xác thực người dùng bằng JWT.
- **Tùy chỉnh trợ lý ảo:** Người dùng có thể đặt tên và chọn hình ảnh cho trợ lý.
- **Nhận diện giọng nói liên tục:** Tương tác thông qua giọng nói với phản hồi thông minh.
- **Thực hiện tác vụ:** Tìm kiếm thông tin, kiểm tra thời gian, mở ứng dụng.
- **Lưu trữ lịch sử tương tác:** Quản lý các yêu cầu và phản hồi trước đó.
- **Triển khai ứng dụng:** Ứng dụng được triển khai đầy đủ và hoạt động mượt mà.

---

## Hướng dẫn cài đặt

### Yêu cầu hệ thống

- Node.js
- MongoDB Atlas account
- Tài khoản Cloudinary

### Các bước cài đặt

#### 1. Clone repository:
```bash
git clone <repository-url>
cd <project-folder>
```

#### 2. Cài đặt các package cần thiết:
```bash
npm install
cd client
npm install
```

#### 3. Cấu hình môi trường:
Tạo file `.env` và thêm các biến môi trường:
```
MONGO_URI=<MongoDB Atlas URI>
CLOUDINARY_API_KEY=<Cloudinary API Key>
JWT_SECRET=<Your JWT Secret>
```

#### 4. Chạy ứng dụng:

**Backend:**
```bash
npm start
```

**Frontend:**
```bash
cd client
npm run dev
```

#### 5. Truy cập ứng dụng:
Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000).

---

## Kết quả đạt được 🚀

Ứng dụng Trợ lý ảo AI cá nhân hóa hoạt động đầy đủ, cung cấp trải nghiệm tương tác tự nhiên và tùy chỉnh, giúp người dùng thực hiện các tác vụ hàng ngày một cách dễ dàng và hiệu quả.
