TCS - HTQLAN (Hệ thống quản lý an ninh cổng) - Bản demo giao diện
=================================================================

CẤU TRÚC THƯ MỤC
  index.html              Trang chính, mở trực tiếp bằng trình duyệt
  css/style.css           Toàn bộ giao diện, biến màu (sáng/tối) đặt ở đầu file
  js/app.js               Dữ liệu demo, phân quyền, điều hướng và các màn hình
  assets/img/logo.png     Logo TCS (màn hình đăng nhập)
  assets/img/sq.png       Logo vuông (thanh menu trái)
  assets/img/banner.jpg   Banner màn hình đăng nhập và bảng điều khiển
  assets/img/photos/      Ảnh minh họa thực tế cho từng chức năng (xem mục NGUỒN ẢNH)
  assets/img/photos/vehicles/  Ảnh xe tải dùng cho khung Kết quả xử lý lane vào/ra

GIAO DIỆN
  Tông màu lấy cảm hứng ngành hàng không Việt Nam: xanh teal #006885 và vàng sen #C9A24D.
  Font Be Vietnam Pro (tải từ Google Fonts khi có mạng, tự dùng font hệ thống khi offline).
  Đổi màu tại khối :root đầu file css/style.css. Có chế độ Sáng/Tối.

KẾT QUẢ XỬ LÝ LANE VÀO / LANE RA
  Khi chưa có xe: ảnh camera trực tiếp kèm hiệu ứng radar và quy trình 4 bước.
  Khi có xe: ảnh camera chụp xe, khung nhận diện biển số ANPR, độ tin cậy, ảnh biển số,
  ảnh tài xế, trạng thái barrier và kết luận Đạt / Không đạt.
  Ảnh xe chọn theo loại xe: veh-1 xe tải nhỏ, veh-4 xe bán tải, veh-3 xe container,
  veh-2 xe không có trong COSYS. Vị trí che biển số trên ảnh chỉnh ở biến PLP trong js/app.js.

THANH MENU (SIDEBAR)
  Màn hình chọn vai trò không hiển thị thanh menu.
  Sau khi chọn vai trò, bấm nút ☰ / ✕ ở góc trái tiêu đề trang để ẩn hoặc hiện thanh menu.
  Trình duyệt ghi nhớ lựa chọn ẩn/hiện cho lần mở sau.

CÁCH CHẠY
  Mở index.html bằng Chrome/Edge. Không cần cài đặt hay máy chủ.
  Giữ nguyên cấu trúc thư mục để trang nạp đúng css, js và ảnh.

DÙNG ẢNH THẬT (TÙY CHỌN)
  1. Chế độ ảnh thật đang BẬT (const CFG={photos:true} trong js/app.js)
  2. Đặt ảnh .jpg vào assets/img/photos/ theo tên:
       lane-in.jpg, lane-out.jpg           Ảnh camera lane vào / lane ra
       plates/<biển số>.jpg                Ảnh biển số xe
       faces/<mã>-in.jpg, faces/<mã>-out.jpg  Ảnh khuôn mặt lúc vào / ra
  Thiếu ảnh nào, hệ thống tự dùng hình minh họa thay thế.

ẢNH MINH HỌA THEO CHỨC NĂNG (assets/img/photos/<mã>.jpg)
  Mỗi màn hình có ảnh banner theo mã chức năng: dash, lane-in, lane-out, mon, lots,
  recv, pay, txn, prices, sur, alert, users, hist, api, rev, trf.
  Thay ảnh thật của TCS: chỉ cần ghi đè file cùng tên (tỷ lệ 16:9, khoảng 1280x720).
  Thông tin chú thích và nguồn ảnh sửa trong biến PH ở đầu js/app.js.

NGUỒN ẢNH (Wikimedia Commons, giấy phép tự do, cần giữ ghi công khi sử dụng)
  banner    Vietnam Airlines Airbus A321 VN-A390 Da Nang 2023 - Bahnfrend - CC BY-SA 4.0
  dash      Cathay Cargo at VVTS - Blue Stahli Luân - CC BY 2.0
  lane-in   International cargo terminal of Air China Cargo at ZBAA - N509FZ - CC BY-SA 4.0
  lane-out  Nighttime guard at a gated alley in Pattaya - PattayaPatrol - CC BY-SA 4.0
  mon       CCTV camera and iFacility IP Audio speaker on a pole - RickySpanish - CC BY-SA 4.0
  lots      Lufthansa Cargo MD-11F D-ALCJ@FRA - Aero Icarus - CC BY-SA 2.0
  recv      Container loading with forklift at warehouse in Thailand - Goterrestrial - CC BY 4.0
  pay       Ingenico ISC250 Payment NETS QR - Sonixrulerz - CC BY-SA 4.0
  txn       Credit card terminal in Laos - Basile Morin - CC BY-SA 4.0
  prices    2008-07-30 FedEx trucks docked at RDU - Ildar Sagdejev - CC BY-SA 4.0
  sur       Old Spot Solar Car Park Shade Structure - Flicker02 - CC BY-SA 4.0
  alert     Van Brienenoordbrug - Closed barrier gate - AgainErick - CC BY-SA 4.0
  users     Whampoa Garden security post - Citobun - CC BY-SA 3.0
  hist      CCTV control room monitor wall - Mark Yeomans - CC BY-SA 4.0
  api       Server Rack (54126210834) - Tony Webster - CC BY 2.0
  rev       Working at National Finance Center - U.S. Department of Agriculture - Public domain
  trf       Trucks on Francis Street, Yarraville - BlackCab - CC BY-SA 4.0
  vehicles/veh-1  Thaco Aumark - Bún bòa - CC0
  vehicles/veh-2  Thaco Ollin 250 in Vietnam - Ilya Plekhanov - CC BY-SA 4.0
  vehicles/veh-3  Thaco Auman - Bún bòa - CC0
  vehicles/veh-4  Thaco Towner 950 in Nha Trang - Ilya Plekhanov - CC BY-SA 4.0
