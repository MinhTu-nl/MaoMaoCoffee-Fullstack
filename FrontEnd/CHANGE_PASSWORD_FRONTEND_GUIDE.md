# Hướng Dẫn Test Tính Năng Thay Đổi Mật Khẩu - Frontend

## 🎯 Tính Năng Đã Thêm

### 1. Nút "Thay Đổi Mật Khẩu"
- Vị trí: Trong trang Profile, bên dưới thông tin email
- Thiết kế: Nút màu xanh với hover effect
- Chức năng: Mở modal form thay đổi mật khẩu

### 2. Modal Form Thay Đổi Mật Khẩu
- **3 trường input**:
  - Mật khẩu hiện tại (password)
  - Mật khẩu mới (password)
  - Xác nhận mật khẩu mới (password)

- **Validation**:
  - Tất cả trường đều bắt buộc
  - Mật khẩu mới phải có ít nhất 8 ký tự
  - Mật khẩu xác nhận phải khớp với mật khẩu mới

- **UI/UX**:
  - Loading state khi đang xử lý
  - Error messages cho từng trường
  - Success/Error notifications
  - Auto-close modal sau khi thành công

## 🚀 Cách Test

### Bước 1: Khởi động ứng dụng
```bash
# Terminal 1 - Backend
cd BackEnd
npm start

# Terminal 2 - Frontend  
cd FrontEnd
npm run dev
```

### Bước 2: Đăng nhập
1. Mở trình duyệt và truy cập frontend
2. Đăng nhập với tài khoản test
3. Điều hướng đến trang Profile

### Bước 3: Test tính năng thay đổi mật khẩu

#### 3.1 Test thành công
1. Click nút "Thay Đổi Mật Khẩu"
2. Nhập mật khẩu hiện tại
3. Nhập mật khẩu mới (ít nhất 8 ký tự)
4. Xác nhận mật khẩu mới
5. Click "Thay Đổi Mật Khẩu"
6. **Kết quả mong đợi**: 
   - Thông báo thành công màu xanh
   - Modal tự động đóng sau 2 giây

#### 3.2 Test validation

**Test mật khẩu hiện tại sai**:
- Nhập mật khẩu hiện tại không đúng
- **Kết quả**: Thông báo lỗi "Mật khẩu hiện tại không đúng"

**Test mật khẩu mới quá ngắn**:
- Nhập mật khẩu mới ít hơn 8 ký tự
- **Kết quả**: Thông báo lỗi "Mật khẩu mới phải có ít nhất 8 ký tự"

**Test mật khẩu xác nhận không khớp**:
- Nhập mật khẩu xác nhận khác với mật khẩu mới
- **Kết quả**: Thông báo lỗi "Mật khẩu xác nhận không khớp"

**Test trường trống**:
- Để trống một hoặc nhiều trường
- **Kết quả**: Thông báo lỗi tương ứng cho từng trường

#### 3.3 Test đăng nhập với mật khẩu mới
1. Sau khi thay đổi mật khẩu thành công
2. Đăng xuất
3. Đăng nhập lại với mật khẩu mới
4. **Kết quả mong đợi**: Đăng nhập thành công

## 🎨 Giao Diện

### Modal Design
- **Header**: Icon user + "Thay Đổi Mật Khẩu"
- **Form**: 3 input fields với labels rõ ràng
- **Buttons**: "Hủy" (gray) và "Thay Đổi Mật Khẩu" (blue)
- **Loading**: Spinner + "Đang xử lý..." khi submit

### Notifications
- **Success**: Thông báo xanh ở góc trên bên phải
- **Error**: Thông báo đỏ ở góc trên bên phải
- **Auto-dismiss**: Tự động ẩn sau 2 giây (success)

### Responsive
- Modal responsive trên mobile
- Input fields full-width
- Buttons stack vertically trên mobile

## 🔧 Technical Details

### Components
- `ChangePasswordModal.jsx`: Modal component
- `Profile.jsx`: Updated với nút và logic xử lý

### API Calls
- **GET** `/api/user/get`: Lấy thông tin user
- **PUT** `/api/user/change-password`: Thay đổi mật khẩu

### State Management
- `showChangePasswordModal`: Hiển thị/ẩn modal
- `changePasswordLoading`: Loading state
- `changePasswordMessage`: Success/Error messages

### Error Handling
- Network errors
- API validation errors
- Form validation errors

## 📱 Test Cases Checklist

- [ ] Modal mở khi click nút "Thay Đổi Mật Khẩu"
- [ ] Modal đóng khi click "Hủy" hoặc "X"
- [ ] Form validation hoạt động đúng
- [ ] Loading state hiển thị khi submit
- [ ] Success notification hiển thị
- [ ] Error notification hiển thị
- [ ] Modal tự đóng sau success
- [ ] Có thể đăng nhập với mật khẩu mới
- [ ] Responsive trên mobile
- [ ] Keyboard navigation hoạt động

## 🐛 Troubleshooting

### Modal không mở
- Kiểm tra console errors
- Kiểm tra import ChangePasswordModal
- Kiểm tra state showChangePasswordModal

### API errors
- Kiểm tra backend đang chạy
- Kiểm tra token có hợp lệ không
- Kiểm tra network tab trong DevTools

### Validation không hoạt động
- Kiểm tra function validateForm
- Kiểm tra state errors
- Kiểm tra event handlers 