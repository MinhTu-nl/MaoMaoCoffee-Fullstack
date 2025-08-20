import multer from "multer";

// Cấu hình multer lưu tạm files lên đĩa với tên file là tên gốc (originalname)
// Lưu ý: trong production bạn có thể muốn đổi tên tệp để tránh trùng lặp và bảo mật.
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        // file.originalname giữ tên file phía client (vd: image.png)
        callback(null, file.originalname)
    }
})

const upload = multer({ storage })
export default upload