# Hệ Thống Phản Hồi Admin-Frontend

## Tổng Quan

Hệ thống phản hồi cho phép admin gửi phản hồi cho các tin nhắn liên hệ từ user, và user có thể xem phản hồi này trong trang Feedback.

## Cấu Trúc Backend

### 1. Contact Controller (`BackEnd/controller/contactController.js`)

#### Các hàm chính:
- `addContact`: User gửi tin nhắn liên hệ
- `getAllContacts`: Admin xem tất cả contact
- `sendFeedback`: Admin gửi phản hồi cho contact
- `getUserContacts`: **MỚI** - User lấy contactData của mình (bao gồm phản hồi từ admin)

### 2. Notification Controller (`BackEnd/controller/notificationController.js`)

#### Các hàm mới:
- `getUserNotifications`: User lấy notifications liên quan đến mình
- `markUserNotificationAsRead`: User đánh dấu notification đã đọc

### 3. Routes

#### Contact Routes (`BackEnd/routes/contactRoute.js`):
```
POST /api/contact/add - User gửi contact
GET /api/contact/user-contacts - User lấy contactData của mình
GET /api/contact/list - Admin xem tất cả contact
PUT /api/contact/feedback/:userId/:contactId - Admin gửi phản hồi
```

#### Notification Routes (`BackEnd/routes/notificationRoute.js`):
```
GET /api/notification/user - User lấy notifications của mình
PATCH /api/notification/user/:notificationId/read - User đánh dấu đã đọc
```

## Cấu Trúc Frontend

### 1. Trang Feedback (`FrontEnd/src/pages/Feedback.jsx`)

**Tính năng:**
- Hiển thị tất cả contactData của user
- Hiển thị phản hồi từ admin (nếu có)
- Sắp xếp theo thời gian mới nhất
- Hiển thị trạng thái (Đã phản hồi/Đang xử lý)
- Giao diện đẹp với Tailwind CSS

**Cách truy cập:**
- Từ trang Profile: Nút "Xem Phản Hồi"
- URL trực tiếp: `/Feedback`

### 2. Component NotificationBell (`FrontEnd/src/components/NotificationBell.jsx`)

**Tính năng:**
- Hiển thị số thông báo chưa đọc
- Dropdown với danh sách notifications
- Đánh dấu đã đọc khi click
- Hiển thị icon theo loại notification
- Chỉ hiển thị khi user đã đăng nhập

**Vị trí:** Trong Navbar (bên cạnh search icon)

### 3. Cập nhật Profile Page

**Thêm nút "Xem Phản Hồi"** trong trang Profile để user dễ dàng truy cập.

## Luồng Hoạt Động

### 1. User gửi tin nhắn liên hệ:
1. User vào trang Contact
2. Điền form và gửi tin nhắn
3. Hệ thống lưu vào `contactData` của user
4. Tạo notification cho admin

### 2. Admin phản hồi:
1. Admin vào Admin Dashboard
2. Xem danh sách contact trong trang Contact
3. Gửi phản hồi cho contact cụ thể
4. Hệ thống cập nhật `feedback` trong `contactData`

### 3. User xem phản hồi:
1. User có thể xem qua:
   - Trang Feedback (từ Profile)
   - NotificationBell trong Navbar
2. Hiển thị tin nhắn gốc và phản hồi từ admin
3. Hiển thị trạng thái và thời gian

## API Endpoints

### Contact Endpoints:
```javascript
// User gửi contact
POST /api/contact/add
Body: { name, email, message }

// User lấy contactData của mình
GET /api/contact/user-contacts
Headers: Authorization: Bearer <token>

// Admin xem tất cả contact
GET /api/contact/list
Headers: Authorization: Bearer <admin_token>

// Admin gửi phản hồi
PUT /api/contact/feedback/:userId/:contactId
Body: { feedback }
Headers: Authorization: Bearer <admin_token>
```

### Notification Endpoints:
```javascript
// User lấy notifications
GET /api/notification/user
Headers: Authorization: Bearer <token>

// User đánh dấu đã đọc
PATCH /api/notification/user/:notificationId/read
Headers: Authorization: Bearer <token>
```

## Cấu Trúc Dữ Liệu

### ContactData trong UserModel:
```javascript
contactData: {
    type: [{
        name: String,
        email: String,
        message: String,
        date: Date,
        feedback: { type: String, default: '' },
        _id: String
    }],
    default: []
}
```

### Notification Model:
```javascript
{
    type: String, // 'contact', 'order', 'review', 'register'
    message: String,
    data: Object, // { userId, name, email, ... }
    isRead: Boolean,
    createdAt: Date
}
```

## Tính Năng Bảo Mật

1. **Authentication**: Tất cả endpoints đều yêu cầu token
2. **Authorization**: User chỉ có thể xem contactData của mình
3. **Admin Protection**: Chỉ admin mới có thể gửi phản hồi
4. **Data Validation**: Kiểm tra input trước khi lưu

## Hướng Dẫn Sử Dụng

### Cho User:
1. Đăng nhập vào hệ thống
2. Gửi tin nhắn liên hệ từ trang Contact
3. Xem phản hồi từ admin trong:
   - Trang Profile → Nút "Xem Phản Hồi"
   - NotificationBell trong Navbar
   - Trang Feedback trực tiếp

### Cho Admin:
1. Đăng nhập vào Admin Dashboard
2. Vào trang Contact để xem danh sách tin nhắn
3. Gửi phản hồi cho từng tin nhắn
4. Hệ thống tự động tạo notification cho user

## Lưu Ý Kỹ Thuật

1. **Real-time Updates**: Hiện tại chưa có real-time, cần refresh để cập nhật
2. **Pagination**: Có thể thêm pagination cho danh sách contact dài
3. **Search/Filter**: Có thể thêm tính năng tìm kiếm và lọc
4. **Email Notifications**: Có thể tích hợp gửi email khi có phản hồi
5. **File Attachments**: Có thể thêm tính năng đính kèm file

## Troubleshooting

### Lỗi thường gặp:
1. **401 Unauthorized**: Kiểm tra token có hợp lệ không
2. **404 Not Found**: Kiểm tra URL endpoint có đúng không
3. **500 Server Error**: Kiểm tra database connection và middleware

### Debug:
1. Kiểm tra console trong browser
2. Kiểm tra server logs
3. Kiểm tra database collections
4. Kiểm tra token trong localStorage
