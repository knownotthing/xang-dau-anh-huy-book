# Tồn kho & bán lẻ xăng dầu Anh Huy

Ứng dụng web offline-first được đóng gói thành APK Android bằng Capacitor 6.

## Build APK bằng GitHub Actions

- Mỗi lần push lên `main`, nhánh `fix/**` hoặc `upgrade-v2`, workflow **Build APK** tự chạy.
- Có thể chạy thủ công trong tab **Actions → Build APK → Run workflow**.
- Khi thành công, mở workflow run và tải artifact **anh-huy-kho-xang-dau-apk**. Bên trong là `app-debug.apk`.
- APK debug dùng để cài nội bộ; không dùng để phát hành Google Play.

## Kết nối Firebase cho giai đoạn kiểm thử Android

### A. Tạo Firebase Web app và lấy config

1. Mở Firebase Console → chọn đúng project.
2. Nhấn bánh răng **Project settings** → tab **General**.
3. Trong **Your apps**, chọn Web app đã tạo (biểu tượng `</>`). Nếu chưa có, **Add app → Web** và đăng ký app nickname; không cần bật Firebase Hosting.
4. Kéo xuống **SDK setup and configuration** → chọn **Config**.
5. Copy object cấu hình gồm các trường `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.

### B. Bật đăng nhập email/mật khẩu

1. Mở **Build → Authentication** (một số giao diện có thể hiện ở nhóm **Security**).
2. Chọn **Get started** nếu lần đầu.
3. Mở tab **Sign-in method** / **Sign-in providers**.
4. Bật **Email/Password** (không cần bật Email link) và Save.
5. Mở tab **Users** → **Add user**; tạo một tài khoản email/mật khẩu nội bộ.
6. Copy giá trị **User UID** của tài khoản vừa tạo. Không dùng email thay cho UID.

### C. Tạo Firestore và khóa quyền truy cập

1. Mở **Build → Firestore Database** (hoặc **Databases & Storage → Firestore**).
2. Chọn **Create database** → **Standard edition** → chọn location gần các điện thoại. Location không đổi được sau khi tạo; nếu có lựa chọn Singapore (`asia-southeast1`), đó là lựa chọn hợp lý khi vận hành tại Việt Nam.
3. Có thể bắt đầu bằng Production mode; nếu chọn Test mode thì phải thay Rules ngay sau khi tạo.
4. Mở tab **Rules**.
5. Mở file `firestore.rules` trong repo. Thay chuỗi `REPLACE_WITH_INTERNAL_USER_UID` bằng User UID đã copy ở bước B, giữ nguyên dấu ngoặc kép.
6. Paste toàn bộ rules vào Firebase Console → **Publish**.

Rules chỉ cho phép UID của tài khoản nội bộ đọc/ghi dữ liệu trong collection `sharedData`. Không dùng rules kiểu `allow read, write: if true`. Nếu cần nhiều tài khoản riêng sau này, thêm các UID được phép vào danh sách; không mở quyền cho mọi tài khoản đã đăng nhập.

### D. Kết nối APK

1. Cài APK build từ commit mới nhất của nhánh `main`.
2. Trên điện thoại, mở app → tab **Lịch sử** → nút **Dữ liệu: xuất Excel, sao lưu, đồng bộ**.
3. Trước khi kết nối máy đầu tiên, bấm **Xuất file Excel** để sao lưu dữ liệu local hiện có.
4. Ở ô **Firebase Web config (JSON)**, dán object config thuần. Không dán `const firebaseConfig =`, không dán dấu `;` cuối dòng. Ví dụ định dạng:

   ```json
   {
     "apiKey": "AIza...",
     "authDomain": "ten-project.firebaseapp.com",
     "projectId": "ten-project",
     "storageBucket": "ten-project.firebasestorage.app",
     "messagingSenderId": "123456789",
     "appId": "1:123456789:web:abcdef"
   }
   ```

   Dùng giá trị thật của project, không dùng ví dụ.
5. Nhập email và password của tài khoản Firebase đã tạo.
6. Nhấn **Kết nối / đăng nhập**. Nếu đây là máy đầu tiên và Firestore chưa có dữ liệu, app sẽ đẩy dữ liệu local hiện tại lên. Nếu Firestore đã có dữ liệu, app sẽ hỏi có tải bản trên cloud xuống thay thế local không.
7. Kết nối từng điện thoại còn lại bằng cùng config và tài khoản. Khi app hỏi tải dữ liệu trên Firebase về thay thế dữ liệu local, chỉ chọn **Đồng ý** nếu máy đầu tiên đã đưa đúng dữ liệu chuẩn lên cloud.

Sau khi kết nối, thay đổi được lưu local trước rồi tự gửi lên Firestore sau một khoảng debounce ngắn; các máy khác đang mở app và có mạng nhận thay đổi qua realtime listener. Nút **Đẩy bản hiện tại** dùng để gửi thủ công; **Tải bản mới nhất** sẽ thay thế toàn bộ dữ liệu local trên máy đó.

**Mỗi lần mở lại APK trong bản hiện tại, hãy mở màn hình Dữ liệu và bấm Kết nối / đăng nhập lại để bật realtime listener.** Nếu mất mạng, app vẫn lưu local; khi có mạng hãy kết nối lại và xử lý đồng bộ có chủ ý.

## Quy trình kiểm thử an toàn

1. Chỉ dùng một điện thoại chính để tạo dữ liệu gốc và đẩy lên Firebase.
2. Điện thoại thứ hai kết nối rồi tải dữ liệu cloud về; kiểm tra số tồn, nhập hàng, bán lẻ, thu/chi và lịch sử có khớp.
3. Mở cả hai máy, thay đổi một trường thử trên máy A; xác nhận máy B nhận cập nhật.
4. Thử thao tác offline trên máy A; xác nhận dữ liệu vẫn lưu local và không bị mất khi đóng/mở app. Kết nối lại rồi kiểm tra dữ liệu.
5. Thử xuất Excel trên từng máy để xác nhận backup/restore vẫn hoạt động.

**Giới hạn hiện tại:** Dữ liệu app được đồng bộ như một snapshot chung trong một Firestore document; không phải cơ sở dữ liệu giao dịch nhiều người dùng. Nếu hai máy sửa cùng lúc, bản ghi sau cùng có thể ghi đè thay đổi trước đó. Trong giai đoạn test, chỉ một máy nên nhập/chốt ca tại một thời điểm. Luôn xuất Excel trước khi thử nghiệm quan trọng. Sau khi test xong mới thiết kế phân quyền người dùng, audit log, đồng bộ theo từng bản ghi và đưa web/iOS vào vận hành.

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

## Chức năng hiện có

- Quản lý bồn, barem, đo tồn kho và cảnh báo tồn thấp.
- Nhập hàng, giá vốn, đơn giá trụ và giao ca.
- Thu/chi, chốt ca, lịch sử và thống kê.
- Xuất/khôi phục Excel.
- Firebase realtime sync (cần Firebase project riêng do chủ cửa hàng quản lý).
