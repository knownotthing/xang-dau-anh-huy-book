# Tồn kho & bán lẻ xăng dầu Anh Huy

Ứng dụng web offline-first được đóng gói thành APK Android bằng Capacitor 6.

## Build APK bằng GitHub Actions

- Mỗi lần push lên `main` hoặc nhánh `fix/**`, workflow **Build APK** tự chạy.
- Có thể chạy thủ công trong tab **Actions → Build APK → Run workflow**.
- Khi thành công, mở workflow run và tải artifact **anh-huy-kho-xang-dau-apk**. Bên trong là `app-debug.apk`.
- APK debug dùng để cài nội bộ; không dùng để phát hành Google Play.

## Build local

Yêu cầu Node.js 20 và JDK 17.

```bash
npm install
npx cap add android
npm run sync
cd android
./gradlew assembleDebug
```

APK: `android/app/build/outputs/apk/debug/app-debug.apk`.

## Đồng bộ dữ liệu thời gian thực cho 2–3 thiết bị

Ứng dụng luôn lưu dữ liệu local trong WebView để tiếp tục làm việc khi offline. Khi cấu hình Firebase và đăng nhập, thay đổi sẽ được gửi lên Firestore và các thiết bị khác đang online nhận bản cập nhật qua realtime listener.

1. Tạo Firebase project tại https://console.firebase.google.com/.
2. Thêm ứng dụng Web trong Project settings và sao chép Firebase config JSON.
3. Authentication → Sign-in method → bật **Email/Password**; tạo một tài khoản nội bộ dùng chung cho các điện thoại trong cửa hàng (chỉ chia sẻ với người được phép).
4. Firestore Database → tạo database.
5. Đưa nội dung file `firestore.rules` trong repo lên Firestore Rules rồi Publish.
6. Trong app mở **Lịch sử → Dữ liệu: xuất Excel, sao lưu, đồng bộ**, dán Firebase Web config, nhập email/mật khẩu và bấm **Kết nối / đăng nhập** trên từng thiết bị.

**Lưu ý vận hành:** Đây là mô hình đồng bộ một bản dữ liệu dùng chung, phù hợp nhóm rất nhỏ 2–3 máy không nhập sửa đồng thời liên tục. Nếu hai máy sửa cùng lúc, bản ghi sau cùng có thể thay thế bản trước; tránh cùng chốt ca hoặc chỉnh tồn kho trên nhiều máy đồng thời. Dữ liệu local và Excel backup vẫn hoạt động khi offline. Không dùng tài khoản này cho người ngoài cửa hàng.

## Chức năng hiện có

- Quản lý bồn, barem, đo tồn kho và cảnh báo tồn thấp.
- Nhập hàng, giá vốn, đơn giá trụ và giao ca.
- Thu/chi, chốt ca, lịch sử và thống kê.
- Xuất/khôi phục Excel.
- Firebase realtime sync (cần Firebase project riêng do chủ cửa hàng quản lý).

## Cấu trúc

- `www/index.html`: giao diện và nghiệp vụ.
- `www/native.js`: cầu nối chia sẻ file Android và Firebase.
- `.github/workflows/android-apk.yml`: pipeline build APK.
- `capacitor.config.json`: cấu hình ứng dụng Android.
