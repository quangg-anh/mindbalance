# XXV. HỆ THỐNG TÌNH HUỐNG BẤT NGỜ

## 1. Nguyên tắc vận hành

Tình huống bất ngờ là các sự kiện không được báo trước, có thể xảy ra sau khi người chơi chọn hành động hoặc nhấn nút “Next”.

Mỗi tình huống nên có:

* Điều kiện xuất hiện.
* Xác suất cơ bản.
* Các yếu tố làm tăng hoặc giảm xác suất.
* Từ hai đến bốn lựa chọn.
* Hậu quả tức thời.
* Hậu quả ẩn.
* Khả năng nối sang sự kiện khác.
* Phản ứng của nhân vật liên quan.

Không phải tình huống nào cũng hoàn toàn tiêu cực. Một sự cố có thể trở thành cơ hội nếu người chơi có đủ chỉ số, mối quan hệ hoặc đưa ra lựa chọn phù hợp.

---

# XXVI. NHÓM TÌNH HUỐNG HỌC TẬP

## 1. Giảng viên kiểm tra đột xuất

### Điều kiện xuất hiện

* Xảy ra sau hành động Học tập hoặc Chơi game.
* Xác suất tăng nếu Minh đã nghỉ học nhiều tháng.
* Xác suất giảm nếu Kiến thức ở mức Cao.

### Bối cảnh

Giảng viên bước vào lớp, đặt tập giấy lên bàn.

> “Hôm nay chúng ta có một bài kiểm tra ngắn. Không được sử dụng tài liệu.”

Huy quay sang Minh:

> “Tôi có linh cảm xấu từ lúc thầy đóng cửa.”

Lan đã lấy bút ra và bắt đầu đọc đề.

### Lựa chọn 1 – Làm bằng khả năng hiện tại

> “Cứ làm được bao nhiêu thì làm.”

Hậu quả:

* Kết quả dựa trên Kiến thức.
* Nếu Kiến thức cao: tăng nhẹ GPA và Tinh thần.
* Nếu Kiến thức thấp: giảm Tinh thần.
* Không ảnh hưởng Đạo đức.

### Lựa chọn 2 – Nhìn bài người bên cạnh

Hậu quả:

* Có khả năng đạt điểm cao hơn.
* Giảm Đạo đức.
* Có xác suất bị phát hiện.
* Nếu bị Lan phát hiện, giảm mạnh Tin tưởng.

Nếu Lan ngồi cạnh:

> “Cậu đang nhìn bài tớ à?”

Người chơi có thể:

* Thừa nhận.
* Phủ nhận.
* Xin giúp sau giờ học.

### Lựa chọn 3 – Nộp giấy trắng

> “Em không làm được.”

Hậu quả:

* Điểm thấp.
* Không giảm Đạo đức.
* Nếu Tinh thần đang thấp, có thể kích hoạt sự kiện “Nghi ngờ bản thân”.
* Lan có thể chủ động mời Minh học nhóm.

### Lựa chọn 4 – Xin hoãn vì lý do sức khỏe

Chỉ hiệu quả nếu Sức khỏe đang thấp.

Nếu Sức khỏe bình thường, giảng viên có thể nghi ngờ.

Hậu quả ẩn:

* Nếu nói thật: không giảm Đạo đức.
* Nếu nói dối: tạo biến `academic_lie`.

---

## 2. Bài tập nhóm bị mất dữ liệu

### Điều kiện xuất hiện

* Minh đang tham gia dự án với Lan.
* Kỹ năng dưới 50 hoặc Tinh thần dưới 25.
* Có xác suất nhỏ xảy ra bất kể chỉ số.

### Bối cảnh

Một ngày trước hạn nộp, tệp dự án không thể mở.

Lan nhìn màn hình:

> “Cậu có bản sao lưu không?”

Minh im lặng.

> “Minh, nói với tớ là cậu có bản sao lưu đi.”

### Lựa chọn 1 – Thức trắng làm lại

Hậu quả:

* Giảm mạnh Sức khỏe và Tinh thần.
* Tăng Kỹ năng.
* Nếu hoàn thành, tăng mạnh Tin tưởng với Lan.
* Có nguy cơ kích hoạt sự kiện kiệt sức.

### Lựa chọn 2 – Thành thật và xin gia hạn

Hậu quả:

* Có thể bị trừ điểm.
* Tăng Đạo đức.
* Nếu Quan hệ với giảng viên tốt, được gia hạn.
* Lan vẫn thất vọng nhưng không mất nhiều Tin tưởng.

### Lựa chọn 3 – Đổ lỗi cho Lan

> “Tớ tưởng cậu giữ bản chính.”

Lan:

> “Cậu vừa nói hôm qua rằng cậu đã lưu rồi.”

Hậu quả:

* Giảm mạnh Tin tưởng.
* Tạo xung đột.
* Có thể khóa tuyến tình cảm.

### Lựa chọn 4 – Thuê người khác làm gấp

Hậu quả:

* Giảm mạnh Tiền.
* Tăng nguy cơ đạo văn.
* Giảm Đạo đức.
* Nếu bị phát hiện, có thể kích hoạt Bad Ending pháp lý hoặc kỷ luật học vụ.

---

## 3. Minh bị tố đạo văn

### Điều kiện xuất hiện

* Minh từng sao chép bài.
* Minh từng thuê người làm bài.
* Có biến `academic_lie`.
* Hoặc xảy ra do trùng lặp vô tình.

### Bối cảnh

Minh nhận email từ phòng đào tạo:

> “Bài nộp của sinh viên có tỷ lệ trùng lặp bất thường. Yêu cầu giải trình trong vòng ba ngày.”

### Lựa chọn 1 – Nhận lỗi

Hậu quả:

* Giảm GPA.
* Giảm nhẹ Đạo đức hoặc giữ nguyên tùy mức độ.
* Tránh hậu quả pháp lý nghiêm trọng.
* Lan có thể thất vọng nhưng vẫn giúp Minh sửa sai.

### Lựa chọn 2 – Chứng minh mình vô tội

Yêu cầu:

* Kỹ năng hoặc Kiến thức từ Trung bình trở lên.
* Có lịch sử tệp hoặc bằng chứng.

Hậu quả:

* Nếu thành công: tăng Tin tưởng với giảng viên.
* Nếu thất bại: hình phạt nặng hơn.

### Lựa chọn 3 – Nhờ người có quan hệ can thiệp

Hậu quả:

* Có thể giảm hình phạt.
* Giảm Đạo đức.
* Tạo một khoản nợ ân tình.
* Sau này nhân vật đó có thể yêu cầu Minh giúp lại.

### Lựa chọn 4 – Trốn tránh

Hậu quả:

* Tăng nguy cơ đình chỉ học.
* Giảm mạnh Tinh thần.
* Lan và Phong có thể tìm Minh để yêu cầu đối diện sự việc.

---

# XXVII. NHÓM TÌNH HUỐNG TÀI CHÍNH

## 1. Chủ trọ tăng tiền phòng đột ngột

### Điều kiện xuất hiện

* Minh sống ngoài ký túc xá.
* Xảy ra từ năm hai trở đi.

### Bối cảnh

Chủ trọ dán thông báo trước cửa:

> “Từ tháng sau, tiền phòng tăng 20%.”

Huy đọc xong rồi nói:

> “Tôi nghĩ căn phòng này vừa tự đánh giá lại giá trị bản thân.”

### Lựa chọn 1 – Chấp nhận

Hậu quả:

* Giảm Tiền mỗi tháng.
* Không mất thời gian chuyển chỗ.
* Nếu Tiền thấp, tăng áp lực Tinh thần.

### Lựa chọn 2 – Thương lượng

Yêu cầu:

* Mối quan hệ hoặc Kỹ năng ở mức Trung bình.

Hậu quả:

* Có thể giảm mức tăng.
* Nếu thất bại, quan hệ với chủ trọ xấu đi.
* Nếu Đạo đức thấp, Minh có thể đe dọa hoặc gây áp lực.

### Lựa chọn 3 – Chuyển trọ

Hậu quả:

* Mất một khoản phí ban đầu.
* Giảm Tinh thần trong tháng.
* Có thể mở khu vực mới và nhân vật mới.
* Có xác suất gặp phòng tốt hơn hoặc tệ hơn.

### Lựa chọn 4 – Ở ghép thêm người

Hậu quả:

* Giảm chi phí.
* Giảm riêng tư.
* Có thể xuất hiện NPC ngẫu nhiên.
* Tạo chuỗi sự kiện mới về xung đột sinh hoạt.

---

## 2. Nhận nhầm tiền chuyển khoản

### Điều kiện xuất hiện

* Xảy ra ngẫu nhiên.
* Tiền của Minh đang ở mức Thấp làm tăng sức hấp dẫn của lựa chọn xấu.

### Bối cảnh

Minh nhận được một khoản tiền lớn từ người lạ.

Tin nhắn ngân hàng ghi:

> “Nội dung: Tiền nhập viện cho mẹ.”

Vài phút sau, điện thoại có cuộc gọi.

### Lựa chọn 1 – Trả lại ngay

Hậu quả:

* Tăng Đạo đức.
* Có tỷ lệ được người gửi cảm ơn và tặng một khoản nhỏ.
* Lan hoặc Mai đánh giá cao nếu biết chuyện.

### Lựa chọn 2 – Giữ lại nhưng chưa tiêu

Hậu quả:

* Không thay đổi ngay.
* Tăng nhẹ Tinh thần vì có cảm giác an toàn.
* Sau vài ngày, người gửi tiếp tục liên hệ.
* Tạo áp lực Đạo đức.

### Lựa chọn 3 – Tiêu một phần rồi trả sau

Hậu quả:

* Tăng Tiền tức thời.
* Tạo khoản nợ ẩn.
* Giảm Đạo đức.
* Có nguy cơ bị báo công an.

### Lựa chọn 4 – Chặn liên lạc

Hậu quả:

* Giảm mạnh Đạo đức.
* Tăng Tiền.
* Có thể kích hoạt sự kiện pháp lý vài tháng sau.

---

## 3. Lừa đảo việc làm online

### Điều kiện xuất hiện

* Minh chọn Làm thêm.
* Kỹ năng dưới Trung bình.
* Tiền thấp hoặc Nợ cao.

### Bối cảnh

Minh nhận được lời mời:

> “Việc nhẹ tại nhà, thu nhập cao. Chỉ cần đóng phí hồ sơ để bắt đầu.”

Phong nhìn tin nhắn:

> “Em nghĩ người ta trả nhiều tiền vì việc này dễ thật à?”

### Lựa chọn 1 – Bỏ qua

Hậu quả:

* Không thay đổi.
* Nếu Phong có mặt, tăng nhẹ Tin tưởng.

### Lựa chọn 2 – Tìm hiểu thêm

Yêu cầu Kỹ năng hoặc Kiến thức.

Hậu quả:

* Có thể phát hiện lừa đảo.
* Tăng Kỹ năng.
* Có khả năng giúp cảnh báo sinh viên khác, tăng Đạo đức.

### Lựa chọn 3 – Đóng phí

Hậu quả:

* Mất Tiền.
* Giảm Tinh thần.
* Có khả năng thông tin cá nhân bị lộ.
* Mở sự kiện “Tài khoản bị đánh cắp”.

### Lựa chọn 4 – Rủ Huy cùng tham gia

Hậu quả:

* Nếu là lừa đảo, cả hai mất tiền.
* Huy giảm Tin tưởng với Minh.
* Nếu Minh đã biết rủi ro mà vẫn rủ, giảm mạnh Đạo đức.

---

## 4. Trúng thưởng giả

### Bối cảnh

Minh nhận tin nhắn:

> “Chúc mừng bạn đã trúng xe máy. Vui lòng chuyển phí nhận thưởng.”

Ông Tư nhìn qua rồi nói:

> “Người ta còn chưa biết tên cậu mà đã muốn cho cậu xe.”

### Lựa chọn

* Xóa tin nhắn.
* Gọi thử.
* Chuyển phí.
* Dùng thông tin giả để điều tra.

Lựa chọn cuối yêu cầu Kỹ năng cao và có thể mở thành tích đặc biệt.

---

# XXVIII. NHÓM TÌNH HUỐNG SỨC KHỎE

## 1. Ngộ độc thực phẩm

### Điều kiện xuất hiện

* Tiền thấp.
* Minh thường ăn đồ rẻ.
* Sức khỏe dưới 50.
* Hoặc xảy ra ngẫu nhiên.

### Bối cảnh

Giữa đêm, Minh tỉnh dậy vì đau bụng dữ dội.

Huy ngồi bật dậy:

> “Ông ổn không?”

### Lựa chọn 1 – Đi bệnh viện

Hậu quả:

* Giảm Tiền.
* Phục hồi Sức khỏe tốt hơn.
* Nếu Quan hệ cao, Huy đi cùng.
* Có thể bỏ lỡ bài kiểm tra.

### Lựa chọn 2 – Tự mua thuốc

Hậu quả:

* Mất ít Tiền.
* Có xác suất khỏi.
* Có xác suất bệnh nặng hơn.

### Lựa chọn 3 – Cố chịu để đi thi

Hậu quả:

* Có thể hoàn thành bài thi.
* Giảm mạnh Sức khỏe.
* Có nguy cơ ngất trong phòng thi.

### Lựa chọn 4 – Gọi cho mẹ

Mẹ:

> “Con ăn gì rồi?”

Minh:

> “Mì.”

Mẹ:

> “Mì gì?”

Minh im lặng.

Hậu quả:

* Tăng Quan hệ gia đình.
* Mẹ gửi tiền hoặc nhờ người quen hỗ trợ.
* Minh có thể cảm thấy có lỗi.

---

## 2. Minh ngất trong lớp

### Điều kiện xuất hiện

* Sức khỏe dưới 25.
* Đã chọn Học tập hoặc Làm thêm nhiều tháng liên tục.
* Ngủ không đủ.

### Bối cảnh

Âm thanh trong lớp nhỏ dần.

Minh chỉ nghe Lan gọi:

> “Minh?”

Màn hình tối.

Khi tỉnh lại, Minh đang ở phòng y tế.

### Nhánh nhân vật

Nếu Lan có Quan hệ cao:

> “Tớ đã nói cậu phải nghỉ.”

Nếu Lan có Quan hệ thấp:

> “Cậu nên gọi người nhà.”

Nếu không có ai thân thiết:

Y tá:

> “Bạn em về hết rồi. Em tự về được không?”

### Lựa chọn

* Nghỉ học một tháng.
* Tiếp tục lịch cũ.
* Nhờ bạn giúp.
* Giấu gia đình.

Tiếp tục lịch cũ có nguy cơ kích hoạt Bad Ending sức khỏe.

---

## 3. Dịch bệnh trong ký túc xá

### Điều kiện xuất hiện

* Xảy ra ngẫu nhiên.
* Tác động nhiều nhân vật.

### Bối cảnh

Ban quản lý thông báo một số sinh viên có triệu chứng lây nhiễm. Khu ký túc xá tạm thời hạn chế ra vào.

### Lựa chọn 1 – Tuân thủ cách ly

Hậu quả:

* Giảm Quan hệ bên ngoài.
* Giảm Tiền làm thêm.
* Có thể tăng Kiến thức nếu học online.
* Tinh thần giảm dần.

### Lựa chọn 2 – Lén ra ngoài làm việc

Hậu quả:

* Tăng Tiền.
* Giảm Đạo đức.
* Có nguy cơ lây bệnh.
* Nếu bị phát hiện, bị kỷ luật.

### Lựa chọn 3 – Hỗ trợ người trong khu cách ly

Hậu quả:

* Tăng Đạo đức và Quan hệ.
* Giảm Sức khỏe.
* Mở hội thoại với nhân vật mới.

### Lựa chọn 4 – Tích trữ thực phẩm rồi bán lại

Hậu quả:

* Tăng Tiền.
* Giảm mạnh Đạo đức.
* Huy và Lan có thể phản ứng tiêu cực.
* Có khả năng bị sinh viên khác tẩy chay.

---

## 4. Chấn thương khi tập thể dục

### Điều kiện xuất hiện

* Chọn Tập thể dục.
* Sức khỏe thấp.
* Tập quá nhiều.
* Hoặc bỏ qua khởi động.

### Bối cảnh

Minh nghe tiếng “rắc” ở cổ chân.

### Lựa chọn

* Đi khám.
* Nghỉ vài ngày.
* Cố tập tiếp.
* Nhờ Huy dìu về.

Nếu nhờ Huy:

> “Tôi biết có ngày thể thao sẽ phản bội ông.”

---

# XXIX. NHÓM TÌNH HUỐNG QUAN HỆ

## 1. Tin đồn về Minh và Lan

### Điều kiện xuất hiện

* Minh và Lan thường xuyên đi cùng nhau.
* Quan hệ từ Trung bình trở lên.

### Bối cảnh

Trong lớp xuất hiện tin đồn Minh và Lan đang hẹn hò.

Huy nói:

> “Tin này lan nhanh hơn điểm thi.”

Lan hỏi Minh:

> “Cậu muốn xử lý thế nào?”

### Lựa chọn 1 – Công khai phủ nhận

Hậu quả:

* Chấm dứt tin đồn.
* Nếu Lan có tình cảm, giảm Thiện cảm.
* Nếu Lan không có tình cảm, tăng Tin tưởng.

### Lựa chọn 2 – Không quan tâm

> “Người khác muốn nghĩ gì thì nghĩ.”

Lan:

> “Cậu không quan tâm, nhưng tớ có thể phải chịu hậu quả.”

Hậu quả:

* Phụ thuộc mức Tin tưởng.
* Có thể khiến Lan thất vọng vì Minh thiếu tinh tế.

### Lựa chọn 3 – Đùa rằng đó là sự thật

Hậu quả:

* Huy thích thú.
* Lan có thể giận nếu Quan hệ chưa đủ cao.
* Nếu tuyến tình cảm đã mở, tạo cảnh ngượng ngùng.

### Lựa chọn 4 – Hỏi cảm xúc của Lan

> “Tin đồn làm cậu khó chịu, hay vì người trong tin đồn là tớ?”

Chỉ xuất hiện nếu Tin tưởng cao.

Có thể mở tuyến tình cảm hoặc gây khoảng cách tùy thời điểm.

---

## 2. Huy lấy tiền của Minh không xin phép

### Điều kiện xuất hiện

* Huy đang gặp khó khăn gia đình.
* Quan hệ với Minh từ Trung bình trở lên.
* Tiền của Huy ở mức rất thấp.

### Bối cảnh

Minh phát hiện tiền trong ví bị thiếu.

Sau khi hỏi, Huy thừa nhận:

> “Tôi định vài ngày nữa trả. Tôi biết tôi nên hỏi.”

### Lựa chọn 1 – Tha thứ ngay

Hậu quả:

* Tăng Thiện cảm.
* Không tăng nhiều Tin tưởng.
* Huy có thể không hiểu mức độ nghiêm trọng.

### Lựa chọn 2 – Yêu cầu Huy trả lại và xin lỗi

Hậu quả:

* Giảm nhẹ Thiện cảm.
* Tăng Tin tưởng dài hạn nếu Huy thực hiện.
* Mở cảnh Huy nói về gia đình.

### Lựa chọn 3 – Nổi giận và cắt quan hệ

Hậu quả:

* Giảm mạnh Quan hệ.
* Huy rời phòng hoặc tránh mặt Minh.
* Bảo vệ tài chính.

### Lựa chọn 4 – Hỏi tại sao Huy không nói

> “Tôi giận vì ông lấy tiền. Nhưng tôi còn giận hơn vì ông nghĩ không thể nói với tôi.”

Hậu quả:

* Tăng Gắn kết nếu Quan hệ đủ cao.
* Mở tuyến hòa giải.

---

## 3. Lan bị người khác nhận công lao

### Điều kiện xuất hiện

* Lan tham gia dự án.
* Minh có mặt trong nhóm hoặc biết sự thật.

### Bối cảnh

Một sinh viên khác trình bày ý tưởng của Lan như của mình.

Lan không phản ứng ngay.

Sau buổi họp, cô nói:

> “Thôi, không đáng để làm lớn chuyện.”

### Lựa chọn 1 – Lên tiếng ngay trong buổi họp

Hậu quả:

* Tăng mạnh Tin tưởng với Lan.
* Có thể tạo xung đột với người khác.
* Tăng Đạo đức.
* Nếu bằng chứng yếu, Minh bị xem là gây rối.

### Lựa chọn 2 – Khuyên Lan tự bảo vệ mình

Hậu quả:

* Lan có thể cảm kích.
* Nếu nói thiếu tinh tế, cô cảm thấy bị đổ lỗi.

### Lựa chọn 3 – Im lặng

Hậu quả:

* Không mất gì tức thời.
* Nếu Lan biết Minh đã thấy, giảm Tin tưởng.

### Lựa chọn 4 – Dùng sự việc để thương lượng lợi ích

> “Tớ có thể làm chứng, nhưng cậu phải giúp tớ việc khác.”

Hậu quả:

* Giảm mạnh Đạo đức.
* Lan mất hoàn toàn Tin tưởng nếu phát hiện.

---

## 4. Người cũ của Lan xuất hiện

### Điều kiện xuất hiện

* Tuyến tình cảm với Lan đang phát triển.
* Quan hệ cao.

### Bối cảnh

Một sinh viên khóa trên quay lại trường và chủ động tìm Lan.

Huy nói nhỏ:

> “Tình tiết này thường không có lợi cho nhân vật chính.”

### Lựa chọn

* Hỏi Lan trực tiếp.
* Tỏ ra không quan tâm.
* Theo dõi họ.
* Tin tưởng Lan.

Theo dõi làm giảm Đạo đức và Tin tưởng nếu bị phát hiện.

Tin tưởng Lan tăng Gắn kết, nhưng người chơi không được biết ngay kết quả.

---

## 5. Sinh nhật bị quên

### Điều kiện xuất hiện

* Sinh nhật của Minh hoặc nhân vật khác.
* Quan hệ ảnh hưởng ai nhớ và ai quên.

### Trường hợp sinh nhật Minh

Nếu Quan hệ cao, Huy và Lan tổ chức bất ngờ.

Huy:

> “Bất ngờ chưa?”

Lan:

> “Cậu ấy thấy bánh từ ngoài cửa rồi.”

Nếu Quan hệ thấp, không ai nhớ.

Cuối ngày, Mai gọi:

> “Anh nghĩ em quên à?”

### Lựa chọn

* Nói mình không quan tâm.
* Thừa nhận mình buồn.
* Tự mua quà cho mình.
* Gọi về nhà.

Cách Minh phản ứng ảnh hưởng Tinh thần và Quan hệ.

---

# XXX. NHÓM TÌNH HUỐNG GIA ĐÌNH

## 1. Cha bị tai nạn lao động

### Điều kiện xuất hiện

* Xảy ra một lần trong bốn năm.
* Xác suất cao hơn nếu gia đình đang khó khăn.

### Bối cảnh

Mai gọi cho Minh lúc nửa đêm.

> “Anh đừng hoảng. Ba đang ở bệnh viện.”

### Lựa chọn 1 – Về quê ngay

Hậu quả:

* Giảm Tiền.
* Bỏ lỡ học hoặc công việc.
* Tăng mạnh Quan hệ gia đình.
* Có thể trượt một kỳ kiểm tra.

### Lựa chọn 2 – Gửi tiền nhưng không về

Hậu quả:

* Giảm Tiền.
* Tăng Quan hệ ít hơn.
* Mai có thể hiểu hoặc thất vọng tùy lịch sử gia đình.

### Lựa chọn 3 – Ở lại vì kỳ thi

Hậu quả:

* Có thể bảo vệ GPA.
* Giảm Quan hệ gia đình.
* Nếu Kiến thức cao, Lan có thể giúp Minh xin hoãn.

### Lựa chọn 4 – Vay tiền và về quê

Hậu quả:

* Tăng Nợ.
* Tăng Đạo đức và Quan hệ.
* Mở chuỗi áp lực tài chính.

---

## 2. Mai muốn bỏ học

### Điều kiện xuất hiện

* Gia đình thiếu tiền.
* Quan hệ với Mai từ Trung bình trở lên.

### Bối cảnh

Mai nói:

> “Em nghỉ một năm cũng được. Anh học xong trước đi.”

### Lựa chọn 1 – Phản đối mạnh

> “Không. Em phải tiếp tục học.”

Mai:

> “Anh nói dễ vì người phải tìm tiền không phải anh.”

Có thể gây tranh cãi.

### Lựa chọn 2 – Gửi tiền hỗ trợ

Hậu quả:

* Giảm Tiền.
* Tăng mạnh Quan hệ.
* Có nguy cơ Minh phải vay nợ.

### Lựa chọn 3 – Cùng Mai tìm học bổng

Yêu cầu Kiến thức hoặc Kỹ năng.

Hậu quả:

* Tốn thời gian.
* Có khả năng giải quyết vấn đề lâu dài.
* Tăng Gắn kết gia đình.

### Lựa chọn 4 – Đồng ý để Mai nghỉ

Hậu quả:

* Giảm áp lực tài chính.
* Mai có thể biết ơn hoặc hối tiếc về sau.
* Ảnh hưởng ending gia đình.

---

## 3. Gia đình giấu Minh một khoản nợ

### Điều kiện xuất hiện

* Năm ba hoặc năm tư.
* Quan hệ gia đình cao giúp Minh phát hiện sớm.

### Bối cảnh

Minh tình cờ thấy giấy vay tiền trong ngăn tủ khi về quê.

Mẹ nói:

> “Cha mẹ tự lo được. Con cứ học đi.”

### Lựa chọn

* Hỏi thẳng.
* Giả vờ chưa thấy.
* Tự trả một phần.
* Trách gia đình đã giấu mình.

Trách gia đình có thể làm giảm Quan hệ nhưng tăng tính chân thực trong cốt truyện.

---

## 4. Một người họ hàng đề nghị công việc

### Bối cảnh

Một người họ hàng đề nghị Minh nghỉ học để làm việc với mức lương khá.

> “Học thêm vài năm cũng chưa chắc kiếm được bằng thế này.”

### Lựa chọn

* Nhận việc.
* Từ chối.
* Làm tạm thời.
* Hỏi ý kiến gia đình.

Nhận việc có thể mở ending “Không làm đúng ngành” hoặc tuyến kinh doanh gia đình.

---

# XXXI. NHÓM TÌNH HUỐNG ĐẠO ĐỨC

## 1. Nhặt được ví tiền

### Bối cảnh

Minh nhặt được một chiếc ví có tiền, giấy tờ và ảnh gia đình.

### Lựa chọn 1 – Trả lại đầy đủ

Hậu quả:

* Tăng Đạo đức.
* Có thể nhận tiền cảm ơn.
* Mở nhân vật phụ mới.

### Lựa chọn 2 – Lấy tiền rồi trả ví

Hậu quả:

* Tăng Tiền.
* Giảm Đạo đức.
* Chủ ví có thể nhận ra số tiền thiếu.
* Có nguy cơ camera ghi lại.

### Lựa chọn 3 – Giữ toàn bộ

Hậu quả:

* Tăng mạnh Tiền.
* Giảm mạnh Đạo đức.
* Có thể dẫn đến sự kiện pháp lý.

### Lựa chọn 4 – Đưa cho bảo vệ

Hậu quả:

* Tăng nhẹ Đạo đức.
* Có xác suất người bảo vệ không trung thực.
* Minh có thể phải quyết định có kiểm tra việc hoàn trả hay không.

---

## 2. Bạn nhờ điểm danh hộ

### Bối cảnh

Một người bạn nhắn:

> “Điểm danh giúp tôi buổi này. Tôi có việc gấp.”

### Lựa chọn

* Đồng ý.
* Từ chối.
* Hỏi lý do.
* Yêu cầu người đó giúp lại một việc.

Nếu lý do là chăm người thân, lựa chọn trở nên khó hơn về mặt đạo đức.

Nếu lý do chỉ là ngủ quên, phản ứng nhân vật khác nhau.

---

## 3. Nhìn thấy gian lận trong kỳ thi

### Bối cảnh

Minh thấy một sinh viên dùng điện thoại trong phòng thi.

### Lựa chọn 1 – Báo giám thị

Hậu quả:

* Tăng Đạo đức.
* Giảm Quan hệ với sinh viên đó.
* Có thể bị cô lập nếu người này có ảnh hưởng.

### Lựa chọn 2 – Im lặng

Hậu quả:

* Không thay đổi ngay.
* Nếu Lan biết, cô có thể hỏi tại sao Minh không nói.

### Lựa chọn 3 – Nhắc người đó dừng lại

Hậu quả:

* Có thể giải quyết mà không báo cáo.
* Có nguy cơ Minh bị nghi liên quan.

### Lựa chọn 4 – Xin đáp án

Hậu quả:

* Tăng khả năng qua môn.
* Giảm mạnh Đạo đức.
* Nguy cơ bị bắt.

---

## 4. Phát hiện Phong làm việc bất hợp pháp

### Điều kiện xuất hiện

* Quan hệ với Phong cao.
* Phong đang nợ nần nghiêm trọng.

### Bối cảnh

Minh phát hiện Phong nhận một công việc sử dụng dữ liệu khách hàng trái phép.

Phong nói:

> “Anh chỉ làm một lần. Tiền này đủ để giải quyết mọi thứ.”

### Lựa chọn

* Khuyên Phong dừng lại.
* Báo cơ quan chức năng.
* Giúp Phong hoàn thành.
* Tìm cách khác để trả nợ.

Đây là sự kiện ảnh hưởng mạnh đến Đạo đức và ending của cả Minh lẫn Phong.

---

# XXXII. NHÓM TÌNH HUỐNG CÔNG VIỆC

## 1. Bị quỵt lương

### Điều kiện xuất hiện

* Chọn Làm thêm.
* Làm cho công việc không chính thức.

### Bối cảnh

Đến ngày nhận lương, chủ quán nói:

> “Tháng này khó khăn. Sang tháng chú trả luôn.”

Phong hỏi:

> “Họ có hợp đồng với em không?”

Minh không trả lời.

### Lựa chọn

* Tiếp tục chờ.
* Nghỉ việc.
* Yêu cầu trả ngay.
* Kêu gọi đồng nghiệp cùng phản đối.

Lựa chọn cuối yêu cầu Quan hệ hoặc Kỹ năng.

---

## 2. Được đề nghị thăng chức

### Điều kiện xuất hiện

* Kỹ năng cao.
* Làm thêm lâu dài.

### Bối cảnh

Quản lý đề nghị Minh nhận nhiều ca hơn với mức lương cao hơn.

### Lựa chọn

* Nhận.
* Từ chối.
* Thương lượng lịch.
* Bỏ học để làm toàn thời gian.

Đây có thể là cơ hội tốt hoặc bước đầu của ending đánh đổi sức khỏe.

---

## 3. Làm sai gây thiệt hại

### Bối cảnh

Minh mắc lỗi khiến cửa hàng hoặc khách hàng mất tiền.

### Lựa chọn 1 – Nhận trách nhiệm

Hậu quả:

* Giảm Tiền để bồi thường.
* Tăng Đạo đức.
* Có thể giữ được công việc.

### Lựa chọn 2 – Đổ lỗi cho đồng nghiệp

Hậu quả:

* Có thể tránh phạt.
* Giảm Đạo đức.
* Nếu bị phát hiện, mất việc và Quan hệ.

### Lựa chọn 3 – Che giấu

Hậu quả:

* Không mất gì ngay.
* Tạo nguy cơ sự kiện điều tra sau này.

### Lựa chọn 4 – Tìm cách sửa trước khi báo cáo

Yêu cầu Kỹ năng.

Nếu thành công, tăng mạnh Kỹ năng và uy tín.

---

## 4. Khách hàng đề nghị tiền riêng

### Bối cảnh

Một khách hàng đề nghị trả tiền riêng để Minh bỏ qua quy trình.

> “Chỉ cần cậu xác nhận giúp. Không ai biết đâu.”

### Lựa chọn

* Từ chối.
* Nhận tiền.
* Báo quản lý.
* Giả vờ nhận để thu thập bằng chứng.

Lựa chọn cuối có rủi ro cao nhưng có thể mở thành tích đặc biệt.

---

# XXXIII. NHÓM TÌNH HUỐNG MAY RỦI

## 1. Trúng giải nhỏ đúng lúc tuyệt vọng

### Điều kiện xuất hiện

* Minh đã mua vé số.
* Tiền thấp hoặc Nợ cao.

### Bối cảnh

Minh dò lại tấm vé và phát hiện mình trúng một khoản vừa đủ trả tiền trọ.

Ông Tư nói:

> “Chúc mừng. Nhưng cậu đang vui vì trúng, hay vì được thở thêm một tháng?”

### Lựa chọn

* Dùng tiền trả nợ.
* Mua thêm vé.
* Gửi về gia đình.
* Mời bạn bè ăn uống.

Mua thêm vé tạo biến `gambling_tendency`.

---

## 2. Gần trúng độc đắc

### Bối cảnh

Vé của Minh chỉ sai một chữ số so với giải độc đắc.

Huy:

> “Chênh một số thôi!”

Ông Tư:

> “Một số cũng xa như một đời.”

### Lựa chọn

* Dừng mua vé.
* Mua gấp nhiều vé hơn.
* Giữ tấm vé làm kỷ niệm.
* Nổi giận và xé vé.

Sự kiện này kiểm tra Tinh thần và xu hướng cờ bạc.

---

## 3. Nhận được một món đồ giá trị

### Bối cảnh

Minh mua đồ cũ và phát hiện bên trong có một món đồ có giá trị.

### Lựa chọn

* Tìm chủ cũ.
* Bán món đồ.
* Giữ lại.
* Hỏi ông Tư hoặc Phong cách xử lý.

Chủ cũ có thể là một NPC quan trọng và mở cơ hội nghề nghiệp.

---

## 4. Được chọn tham gia chương trình trao đổi

### Điều kiện xuất hiện

* Kiến thức, Kỹ năng hoặc Quan hệ cao.
* Xảy ra ngẫu nhiên trong nhóm sinh viên đủ điều kiện.

### Bối cảnh

Minh nhận email:

> “Do một sinh viên khác rút lui, bạn được mời thay thế trong chương trình trao đổi.”

### Lựa chọn

* Nhận lời.
* Từ chối vì tiền.
* Vay tiền để đi.
* Nhờ nhà trường hỗ trợ.

Đây là cơ hội lớn nhưng có thể khiến Minh xa gia đình hoặc bỏ lỡ các sự kiện nhân vật.

---

# XXXIV. NHÓM TÌNH HUỐNG CÔNG NGHỆ VÀ MẠNG XÃ HỘI

## 1. Tài khoản mạng xã hội bị chiếm

### Điều kiện xuất hiện

* Minh từng tham gia việc làm online đáng ngờ.
* Kỹ năng thấp.
* Hoặc xảy ra ngẫu nhiên.

### Bối cảnh

Tài khoản Minh bắt đầu gửi tin nhắn vay tiền đến bạn bè.

Huy gọi:

> “Ông đang nhắn tôi chuyển tiền hay tài khoản ông bị hack?”

### Lựa chọn

* Đổi mật khẩu ngay.
* Nhờ Huy hoặc Phong hỗ trợ.
* Giả vờ không biết.
* Cố truy tìm người tấn công.

Hậu quả có thể ảnh hưởng Quan hệ nếu bạn bè đã gửi tiền.

---

## 2. Video của Minh bất ngờ nổi tiếng

### Bối cảnh

Một đoạn video Minh giúp người gặp tai nạn được đăng lên mạng và lan truyền.

### Lựa chọn 1 – Tận dụng danh tiếng

Hậu quả:

* Tăng Quan hệ và cơ hội.
* Có thể kiếm Tiền.
* Nếu quá phô trương, giảm Đạo đức.

### Lựa chọn 2 – Yêu cầu xóa video

Hậu quả:

* Giữ sự riêng tư.
* Không nhận lợi ích danh tiếng.
* Lan đánh giá cao sự kín đáo.

### Lựa chọn 3 – Kể sai sự thật để nổi tiếng hơn

Hậu quả:

* Tăng lợi ích ngắn hạn.
* Tạo nguy cơ bị bóc trần.

### Lựa chọn 4 – Dùng sự chú ý để gây quỹ cho nạn nhân

Hậu quả:

* Tăng mạnh Đạo đức.
* Tăng Quan hệ.
* Mở sự kiện cộng đồng.

---

## 3. Bị bôi nhọ trên mạng

### Bối cảnh

Một bài đăng ẩn danh cáo buộc Minh gian lận, sống ích kỷ hoặc lợi dụng bạn bè.

Một phần thông tin có thể đúng, sai hoặc bị bóp méo.

### Lựa chọn

* Phản hồi công khai.
* Im lặng.
* Tìm người đăng.
* Nhờ bạn bè lên tiếng.

Phản ứng của Lan, Huy và Phong phụ thuộc việc cáo buộc có đúng với lịch sử lựa chọn của Minh hay không.

---

# XXXV. TÌNH HUỐNG BẤT NGỜ LIÊN QUAN NHIỀU NHÂN VẬT

## 1. Lan và Huy xảy ra mâu thuẫn

### Bối cảnh

Huy quên gửi một phần tài liệu khiến nhóm của Lan gặp rắc rối.

Lan:

> “Cậu lúc nào cũng nghĩ có thể dùng một câu đùa để bỏ qua mọi chuyện.”

Huy:

> “Còn cậu lúc nào cũng nghĩ ai không sống giống cậu đều là người vô trách nhiệm.”

Cả hai nhìn Minh.

### Lựa chọn 1 – Bênh Lan

Hậu quả:

* Tăng Thiện cảm với Lan.
* Giảm Quan hệ với Huy.
* Nếu Lan sai một phần, cô có thể cảm thấy Minh đang chiều ý mình.

### Lựa chọn 2 – Bênh Huy

Hậu quả ngược lại.

### Lựa chọn 3 – Chỉ ra lỗi của cả hai

Yêu cầu Tin tưởng với cả hai ở mức Trung bình.

Hậu quả:

* Có thể hòa giải.
* Nếu cách nói quá thẳng, cả hai cùng giận Minh.

### Lựa chọn 4 – Rời đi

Hậu quả:

* Không chịu mất Quan hệ tức thời.
* Xung đột kéo dài sang tháng sau.
* Nhóm có thể tan rã.

---

## 2. Phong biết Minh đang vay nợ

### Bối cảnh

Phong nhìn thấy tin nhắn đòi nợ trên điện thoại Minh.

> “Em vay từ bao giờ?”

### Lựa chọn

* Nói thật.
* Giấu tiếp.
* Nhờ Phong giúp.
* Trách Phong đã nhìn điện thoại.

Nếu Minh nói thật, Phong có thể chia sẻ chính sai lầm của mình.

---

## 3. Mai bất ngờ lên thành phố

### Bối cảnh

Minh mở cửa phòng và thấy Mai đứng ngoài.

> “Em có cuộc thi gần đây. Em không báo vì muốn xem anh sống thế nào.”

Tình trạng căn phòng, Sức khỏe, Tiền và các mối quan hệ của Minh sẽ ảnh hưởng hội thoại.

Nếu phòng bừa bộn và Minh đang kiệt sức:

**Mai:**

> “Đây là ‘anh vẫn ổn’ mà anh nói với em à?”

Nếu Minh sống tốt:

> “Hóa ra anh cũng biết tự chăm sóc bản thân.”

### Lựa chọn

* Dẫn Mai đi chơi.
* Giấu tình trạng thật.
* Nhờ Lan hoặc Huy tiếp Mai.
* Nói thật về những khó khăn.

---

## 4. Cả nhóm bị kẹt trong thang máy

### Bối cảnh

Minh, Lan, Huy và Phong bị kẹt trong thang máy của trường.

Huy:

> “Nếu đây là phút cuối, tôi muốn thú nhận là tôi đã ăn hộp bánh trong tủ lạnh.”

Lan:

> “Tớ biết.”

Phong:

> “Tập trung gọi cứu hộ đi.”

### Công dụng

Đây là sự kiện nhẹ, giúp:

* Tăng Quan hệ nhóm.
* Mở các câu chuyện cá nhân.
* Tạo lựa chọn hài hước.
* Có thể trở nên nghiêm trọng nếu Sức khỏe Minh thấp hoặc có nhân vật sợ không gian kín.

### Lựa chọn

* Trấn an mọi người.
* Pha trò cùng Huy.
* Tranh thủ nói chuyện riêng với Lan.
* Hoảng loạn.

---

# XXXVI. TÌNH HUỐNG BẤT NGỜ HIẾM

## 1. Minh được học bổng toàn phần

### Xác suất

Rất thấp.

### Điều kiện

* Kiến thức từ Cao trở lên.
* Đạo đức không ở mức Thấp.
* Không có vi phạm học thuật.

### Hậu quả

* Tăng mạnh Tiền và Tinh thần.
* Giảm áp lực làm thêm.
* Gia đình tự hào.
* Có thể tạo áp lực mới vì Minh sợ mất học bổng.

---

## 2. Một người lạ trả toàn bộ viện phí

### Điều kiện

* Minh từng giúp người bị tai nạn.
* Có biến sự kiện Đạo đức tích cực.

### Bối cảnh

Khi Minh gặp tai nạn, viện phí đã được thanh toán một phần.

Y tá đưa Minh một mảnh giấy:

> “Cảm ơn cậu vì ngày hôm đó đã dừng lại.”

Đây là hậu quả tích cực bị trì hoãn từ một lựa chọn cũ.

---

## 3. Cơ hội đầu tư bất ngờ

### Điều kiện

* Kỹ năng và Kiến thức cao.
* Minh có một khoản tiền.
* Có thể liên quan Happy Ending trúng số.

### Bối cảnh

Phong giới thiệu một dự án nhỏ đang cần vốn.

### Lựa chọn

* Đầu tư thận trọng.
* Đầu tư toàn bộ.
* Từ chối.
* Tham gia bằng công sức thay vì tiền.

Dự án có thể thành công, thất bại hoặc bị lừa tùy biến ẩn.

---

## 4. Người nổi tiếng ghé nơi Minh làm thêm

### Bối cảnh

Một người có ảnh hưởng đến cửa hàng nơi Minh làm.

### Lựa chọn

* Phục vụ bình thường.
* Xin chụp ảnh.
* Quay lén.
* Tận dụng cơ hội giới thiệu sản phẩm hoặc kỹ năng.

Kỹ năng cao có thể biến sự kiện thành cơ hội nghề nghiệp.

Quay lén làm giảm Đạo đức và có nguy cơ mất việc.

---

## 5. Minh được đề nghị tham gia chương trình truyền hình

### Điều kiện

* Video của Minh từng nổi tiếng.
* Quan hệ xã hội cao.

### Lựa chọn

* Tham gia.
* Từ chối.
* Chỉ tham gia nếu được nói về vấn đề cộng đồng.
* Yêu cầu tiền cao.

Sự kiện có thể tăng Tiền và Quan hệ nhưng giảm Tinh thần do áp lực dư luận.

---

# XXXVII. TÌNH HUỐNG ĐẢO NGƯỢC KỲ VỌNG

## 1. Người Minh giúp lại là kẻ lừa đảo

Minh giúp một người bị ngã xe. Sau đó người này đòi tiền và tố Minh gây tai nạn.

### Ý nghĩa

Lựa chọn đạo đức không luôn nhận phần thưởng ngay.

Người chơi phải quyết định:

* Tiếp tục giúp người khác trong tương lai.
* Trở nên nghi ngờ.
* Tìm bằng chứng.
* Nhờ nhân vật khác hỗ trợ.

---

## 2. Người Minh từ chối giúp lại thành công

Một người từng nhờ Minh giúp dự án nhưng bị từ chối sau đó đạt giải lớn.

Người chơi không bị phạt trực tiếp, nhưng có thể cảm thấy tiếc nuối.

Sự kiện này cho thấy không phải mọi cơ hội bị bỏ qua đều có thể lấy lại.

---

## 3. Công việc lương thấp tạo cơ hội lớn

Một công việc tưởng như không đáng giá giúp Minh gặp được người cố vấn hoặc khách hàng đầu tiên.

Điều kiện thành công phụ thuộc thái độ làm việc và Kỹ năng, không chỉ thời gian bỏ ra.

---

## 4. Vé số trúng nhưng bị mất

Minh phát hiện vé đã trúng giải nhỏ hoặc lớn nhưng không tìm thấy tấm vé.

### Lựa chọn

* Tìm lại.
* Nghi Huy lấy.
* Chấp nhận mất.
* Báo cơ quan phát hành.

Nếu Minh nghi oan Huy, Quan hệ bị tổn hại nghiêm trọng.

---

## 5. Người Minh ghét lại giúp mình

Một sinh viên từng xung đột với Minh là người gọi xe cấp cứu khi Minh gặp tai nạn.

Sau đó người này nói:

> “Tôi không thích cậu. Nhưng tôi không thể đứng nhìn.”

Sự kiện buộc người chơi nhìn lại cách đánh giá con người.

---

# XXXVIII. TÌNH HUỐNG DỰA TRÊN CHỈ SỐ CỰC ĐOAN

## 1. Kiến thức Cực cao

Sự kiện:

* Được giảng viên mời làm trợ giảng.
* Bị bạn bè nhờ làm bài hộ.
* Chịu áp lực phải luôn đạt điểm cao.
* Bị xem là kiêu ngạo nếu giao tiếp kém.
* Nhận cơ hội học thuật lớn nhưng mất thời gian cá nhân.

## 2. Kỹ năng Cực cao

Sự kiện:

* Nhận nhiều việc freelance.
* Bị khách hàng lợi dụng.
* Được đề nghị bỏ học để đi làm.
* Có cơ hội khởi nghiệp.
* Bị giao quá nhiều trách nhiệm trong dự án nhóm.

## 3. Sức khỏe Cực cao

Sự kiện:

* Được rủ tham gia giải thể thao.
* Có thể giúp người khác trong tai nạn.
* Bị chủ quan và luyện tập quá sức.
* Có cơ hội kiếm thêm từ công việc thể lực.

## 4. Tinh thần Cực cao

Sự kiện:

* Trở thành người động viên nhóm.
* Nhân vật khác chủ động tâm sự.
* Có khả năng chống lại sự kiện khủng hoảng.
* Dễ bị người khác dựa dẫm quá nhiều.

## 5. Tiền Cực cao

Sự kiện:

* Bạn bè hỏi vay tiền.
* Bị dụ đầu tư.
* Gia đình kỳ vọng Minh hỗ trợ.
* Xuất hiện nhân vật tiếp cận vì lợi ích.
* Minh phải phân biệt quan hệ thật và quan hệ vì tiền.

## 6. Đạo đức Cực cao

Sự kiện:

* Được tin tưởng giao nhiệm vụ quan trọng.
* Thường xuyên bị nhờ giúp.
* Có nguy cơ hy sinh bản thân quá mức.
* Phải chọn giữa nguyên tắc và bảo vệ người thân.

## 7. Mối quan hệ Cực cao

Sự kiện:

* Nhận nhiều lời mời cùng lúc.
* Khó cân bằng thời gian cho mọi người.
* Hai nhân vật có thể ghen hoặc mâu thuẫn.
* Nhóm có thể cứu Minh khỏi một Bad Ending.

---

# XXXIX. CƠ CHẾ HẬU QUẢ BỊ TRÌ HOÃN

Một số tình huống không nên hiển thị kết quả ngay.

Ví dụ:

## Lựa chọn

Minh cho một người lạ mượn điện thoại.

### Hậu quả tức thời

Không có thay đổi rõ ràng.

### Sau hai tháng

Có thể xảy ra một trong các kết quả:

* Người đó gửi quà cảm ơn.
* Tài khoản Minh nhận tin nhắn lạ.
* Minh bị liên hệ vì cuộc gọi liên quan sự việc pháp lý.
* Người đó trở thành nhân vật phụ có ích.

Người chơi không biết trước kết quả nào sẽ xảy ra.

---

## Một ví dụ khác

Minh từ chối cho Huy vay tiền.

### Hậu quả tức thời

Giảm nhẹ Quan hệ.

### Hậu quả ẩn

* Huy tự tìm công việc.
* Huy vay nguồn nguy hiểm.
* Huy xin gia đình giúp.
* Huy bỏ một kỳ học.
* Huy trưởng thành và tôn trọng việc Minh đặt giới hạn.

Điều này giúp lựa chọn không bị chia thành “tốt” và “xấu” quá đơn giản.

---

# XL. CƠ CHẾ CHUỖI SỰ KIỆN BẤT NGỜ

Mỗi tình huống có thể mở một chuỗi gồm từ hai đến năm sự kiện.

## Ví dụ: Chuỗi lừa đảo việc làm

### Giai đoạn 1

Minh nhận lời mời việc nhẹ lương cao.

### Giai đoạn 2

Minh chuyển phí hồ sơ.

### Giai đoạn 3

Tài khoản liên hệ biến mất.

### Giai đoạn 4

Thông tin cá nhân của Minh bị sử dụng để vay tiền.

### Giai đoạn 5

Minh phải lựa chọn:

* Báo công an.
* Tự giải quyết.
* Nhờ Phong.
* Vay khoản mới để trả.

Chuỗi này có thể dẫn đến:

* Tăng Kỹ năng nếu giải quyết thành công.
* Tăng Nợ.
* Giảm Tinh thần.
* Bad Ending pháp lý nếu Minh tham gia sâu hơn.

---

## Ví dụ: Chuỗi người bị tai nạn

### Giai đoạn 1

Minh dừng lại giúp người bị ngã.

### Giai đoạn 2

Minh bị nghi gây tai nạn.

### Giai đoạn 3

Lan hoặc Huy tìm camera làm bằng chứng.

### Giai đoạn 4

Minh được minh oan.

### Giai đoạn 5

Người thật sự gây tai nạn xin lỗi hoặc bỏ trốn.

Kết quả phụ thuộc:

* Quan hệ.
* Kỹ năng.
* Đạo đức.
* Việc Minh có giữ bình tĩnh hay không.

---

# XLI. TÌNH HUỐNG BẤT NGỜ ĐẶC BIỆT THEO NĂM

## Năm nhất

Ưu tiên các tình huống:

* Lạc đường.
* Mất đồ.
* Bị lừa mua hàng.
* Kiểm tra đột xuất.
* Xung đột bạn cùng phòng.
* Tai nạn giao thông.
* Nhớ nhà.
* Tiêu quá tay.
* Bị sốc văn hóa thành phố.

Mục tiêu là tạo cảm giác Minh còn non nớt và chưa thích nghi.

## Năm hai

Ưu tiên:

* Việc làm.
* Bài tập nhóm.
* Quan hệ bạn bè.
* Áp lực tài chính.
* Gian lận học tập.
* Sự kiện tình cảm.
* Gia đình bắt đầu gặp khó khăn.

Mục tiêu là buộc người chơi xác định ưu tiên.

## Năm ba

Ưu tiên:

* Khủng hoảng tinh thần.
* Thực tập.
* Nợ nần.
* Xung đột với nhân vật.
* Bị phản bội.
* Cơ hội nghề nghiệp.
* Sức khỏe suy giảm.
* Bí mật gia đình.

Mục tiêu là đẩy người chơi đối diện hậu quả tích lũy.

## Năm tư

Ưu tiên:

* Kỳ thi tốt nghiệp.
* Lời mời công việc.
* Khoản nợ cuối.
* Lựa chọn ở lại hay về quê.
* Quan hệ tình cảm.
* Cơ hội đổi đời.
* Sự kiện chia tay.
* Hậu quả từ các lựa chọn cũ quay trở lại.

Mục tiêu là tổng kết hành trình và dẫn đến ending.

---

# XLII. TỶ LỆ XUẤT HIỆN ĐỀ XUẤT

## Tình huống phổ biến

Xác suất từ 15% đến 30% mỗi tháng.

Ví dụ:

* Kiểm tra đột xuất.
* Mất đồ.
* Cãi nhau nhỏ.
* Bị ốm.
* Chi phí phát sinh.

## Tình huống không phổ biến

Xác suất từ 5% đến 15%.

Ví dụ:

* Bị quỵt lương.
* Nhặt được ví.
* Tài khoản bị hack.
* Gia đình gặp khó khăn.
* Bị tố đạo văn.

## Tình huống hiếm

Xác suất từ 0,5% đến 5%.

Ví dụ:

* Học bổng toàn phần.
* Video nổi tiếng.
* Cơ hội đầu tư lớn.
* Chương trình trao đổi.
* Gặp người có ảnh hưởng.

## Tình huống cực hiếm

Xác suất dưới 0,5%.

Ví dụ:

* Trúng độc đắc.
* Người từng được cứu trả viện phí.
* Cơ hội đổi đời bất ngờ.
* Sự kiện đặc biệt liên quan nhiều tuyến cốt truyện.

---

# XLIII. NGUYÊN TẮC CÂN BẰNG TÌNH HUỐNG

## 1. Không trừng phạt người chơi liên tục

Sau hai sự kiện tiêu cực lớn liên tiếp, xác suất xuất hiện sự kiện tích cực nên tăng.

## 2. Không để may mắn thay thế chiến thuật

Sự kiện may mắn có thể cứu người chơi tạm thời nhưng không được xóa hoàn toàn hậu quả dài hạn.

## 3. Chỉ số cao không bảo đảm kết quả hoàn hảo

Kiến thức cao giúp Minh giải quyết vấn đề tốt hơn nhưng không ngăn được mọi tai nạn.

Quan hệ cao giúp có người hỗ trợ nhưng cũng tạo thêm trách nhiệm.

Tiền cao giải quyết nhiều khó khăn nhưng có thể thu hút người lợi dụng.

## 4. Chỉ số thấp không luôn đồng nghĩa thất bại

Tinh thần thấp có thể mở cảnh hội thoại sâu với nhân vật.

Tiền thấp có thể dẫn đến cơ hội học bổng hoặc công việc.

Kiến thức thấp có thể thúc đẩy Minh phát triển Kỹ năng.

## 5. Lựa chọn tốt phải có cái giá

Về quê chăm cha giúp tăng Quan hệ nhưng có thể khiến Minh trượt thi.

Giúp Huy trả viện phí làm tăng Đạo đức nhưng khiến Minh thiếu tiền.

Tố cáo gian lận bảo vệ nguyên tắc nhưng có thể khiến Minh bị cô lập.

## 6. Lựa chọn xấu phải có sức hấp dẫn

Gian lận có thể giúp qua môn.

Vay tiền có thể giải quyết khủng hoảng.

Nói dối có thể giữ một mối quan hệ trong ngắn hạn.

Giữ ví tiền có thể cứu Minh khỏi bị đuổi trọ.

Người chơi phải thực sự cảm thấy bị giằng co trước mỗi lựa chọn.

---

# XLIV. MẪU HIỂN THỊ TRONG GAME

## Trước sự kiện

Màn hình tối nhẹ.

Âm thanh môi trường dừng lại.

Dòng chữ xuất hiện:

> **Một chuyện không nằm trong kế hoạch đã xảy ra.**

Sau đó chuyển sang cảnh nhân vật.

## Sau khi lựa chọn

Không hiển thị ngay toàn bộ chỉ số thay đổi.

Chỉ hiện các phản ứng bề mặt:

> Lan im lặng lâu hơn bình thường.

> Huy không còn nhìn Minh.

> Minh cảm thấy nhẹ nhõm, nhưng chỉ trong chốc lát.

> Một khoản tiền vừa được chuyển vào tài khoản.

> Sự việc dường như đã kết thúc.

Một số hậu quả được đánh dấu ngầm và chỉ xuất hiện sau vài tháng.

---

# XLV. VÍ DỤ TÌNH HUỐNG HOÀN CHỈNH

## Tên sự kiện: Chiếc điện thoại dưới mưa

### Thời điểm

Năm hai hoặc năm ba.

### Điều kiện

Minh vừa chọn hành động Đi chơi, Làm thêm hoặc Tập thể dục.

### Bối cảnh

Trên đường về, Minh nhìn thấy một chiếc điện thoại nằm gần trạm xe buýt.

Màn hình vẫn sáng.

Có một cuộc gọi đến với tên:

> “Mẹ”

Mưa bắt đầu nặng hạt.

### Lựa chọn 1 – Nghe máy

Minh:

> “A lô?”

Một giọng phụ nữ hoảng hốt:

> “Con đang ở đâu vậy?”

Minh giải thích mình vừa nhặt được điện thoại.

Hậu quả:

* Tăng Đạo đức.
* Mở chuỗi tìm chủ nhân.
* Chủ điện thoại có thể là sinh viên đang gặp tai nạn.
* Minh phải quyết định có bỏ kế hoạch hiện tại để giúp hay không.

### Lựa chọn 2 – Mang đến đồn bảo vệ

Hậu quả:

* Tăng nhẹ Đạo đức.
* Mất thời gian.
* Nếu chủ điện thoại tìm được, có thể gửi lời cảm ơn.
* Nếu bảo vệ không đáng tin, sự kiện có thể tiếp tục.

### Lựa chọn 3 – Giữ điện thoại

Hậu quả:

* Có thể bán lấy Tiền.
* Giảm mạnh Đạo đức.
* Điện thoại có định vị.
* Sau vài ngày, công an hoặc chủ nhân tìm đến.

### Lựa chọn 4 – Để nguyên tại chỗ

Hậu quả:

* Không thay đổi tức thời.
* Tinh thần có thể giảm nhẹ.
* Vài ngày sau, Minh đọc tin một sinh viên mất tích gần khu vực đó.

### Nhánh bất ngờ

Nếu Minh nghe máy và đi tìm chủ điện thoại, cậu phát hiện một sinh viên bị ngã trong con hẻm gần đó.

Minh phải chọn:

* Gọi cấp cứu.
* Tự đưa người đó đến bệnh viện.
* Gọi Huy hoặc Lan giúp.
* Rời đi vì sợ liên lụy.

Nếu cứu người:

* Tăng Đạo đức.
* Giảm Tiền viện phí tạm ứng.
* Có nguy cơ bị hiểu lầm là người gây tai nạn.
* Sau này người được cứu có thể trở thành nhà tuyển dụng hoặc nhân vật phụ quan trọng.

Sự kiện bắt đầu từ một chiếc điện thoại nhưng có thể ảnh hưởng tới:

* Đạo đức.
* Tiền.
* Sức khỏe.
* Quan hệ.
* Cơ hội nghề nghiệp.
* Sự kiện pháp lý.
* Ending cuối game.

Đây là cấu trúc lý tưởng cho một tình huống bất ngờ trong trò chơi.
