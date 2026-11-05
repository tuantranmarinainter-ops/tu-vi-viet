export type DetailedTopic = 'overview' | 'career' | 'wealth' | 'love';

export const STAR_TOPIC_CONTENT: Record<string, Record<DetailedTopic, { meaning: string; balance: string }>> = {
  '紫微': {
    overview: { meaning: 'Tử Vi tượng trưng cho cách bạn tự định hướng, nhận trách nhiệm và sắp xếp những việc có nhiều người cùng tham gia.', balance: 'Hãy phân biệt phần việc mình cần quyết với phần có thể tin cậy giao cho người khác.' },
    career: { meaning: 'Trong công việc, Tử Vi gợi cách tiếp cận có tổ chức, coi trọng quyền chủ động và muốn thấy trách nhiệm được phân định rõ.', balance: 'Thống nhất tiêu chí và quyền hạn trước khi đứng ra điều phối.' },
    wealth: { meaning: 'Ở chủ đề tài chính, Tử Vi gợi nhu cầu chủ động đặt mục tiêu và nắm rõ cách các nguồn lực được quản lý.', balance: 'Định kỳ xem lại mục tiêu chi tiêu và phần trách nhiệm tài chính thực sự thuộc về mình.' },
    love: { meaning: 'Trong tình cảm, Tử Vi gợi mong muốn có tiếng nói và cùng xây dựng một mối quan hệ rõ ràng, có trách nhiệm.', balance: 'Chủ động hỏi ý kiến và để cả hai cùng tham gia quyết định.' },
  },
  '天机': {
    overview: { meaning: 'Thiên Cơ tượng trưng cho lối nhìn phân tích, linh hoạt và thường tìm hơn một phương án trước khi lựa chọn.', balance: 'Chọn một bước thử nhỏ để suy tính chuyển thành hành động có thể đánh giá.' },
    career: { meaning: 'Trong công việc, Thiên Cơ gợi năng lực phân tích quy trình, điều chỉnh cách làm và tìm hướng xử lý khi yêu cầu thay đổi.', balance: 'Ghi lại quyết định cùng thời hạn xem xét để tránh liên tục đổi hướng.' },
    wealth: { meaning: 'Ở chủ đề tài chính, Thiên Cơ gợi thói quen cân nhắc nhiều cách phân bổ nguồn lực và tìm thông tin trước khi quyết định.', balance: 'Dựa vào ngân sách và dữ kiện đã kiểm tra thay vì tiếp tục tính các kịch bản không cần thiết.' },
    love: { meaning: 'Trong tình cảm, Thiên Cơ gợi cách suy ngẫm về tương tác và tìm cách điều chỉnh khi nhu cầu đôi bên thay đổi.', balance: 'Nói thẳng điều đang băn khoăn rồi cùng chọn một thay đổi có thể thử.' },
  },
  '太阳': {
    overview: { meaning: 'Thái Dương tượng trưng cho sự chủ động, cởi mở và mong muốn đóng góp rõ ràng vào việc chung.', balance: 'Kiểm tra sức mình trước khi nhận thêm trách nhiệm hoặc lời nhờ vả.' },
    career: { meaning: 'Trong công việc, Thái Dương gợi cách làm có tính khởi xướng, chia sẻ thông tin và hướng nỗ lực vào đóng góp hữu ích.', balance: 'Làm rõ phạm vi đóng góp để sự nhiệt tình không biến thành ôm hết việc.' },
    wealth: { meaning: 'Ở chủ đề tài chính, Thái Dương gợi xu hướng coi nguồn lực là phương tiện hỗ trợ mục tiêu chung hoặc những người mình quan tâm.', balance: 'Cân nhắc nhu cầu của bản thân cùng cam kết hỗ trợ trước khi phân bổ tiền bạc.' },
    love: { meaning: 'Trong tình cảm, Thái Dương gợi cách thể hiện quan tâm bằng sự hiện diện, chủ động và sẵn lòng chia sẻ.', balance: 'Hỏi xem sự hỗ trợ nào được mong đợi thay vì tự quyết định thay người kia.' },
  },
  '武曲': {
    overview: { meaning: 'Vũ Khúc tượng trưng cho cách tiếp cận thực tế, có kỷ luật và chú ý đến kết quả cụ thể.', balance: 'Để ý cả cách tiến hành và cảm nhận của những người cùng tham gia.' },
    career: { meaning: 'Trong công việc, Vũ Khúc gợi khả năng bám mục tiêu, duy trì quy trình và biến yêu cầu thành đầu việc đo đếm được.', balance: 'Trao đổi tiêu chí hoàn thành và phản hồi bằng lời lẽ dễ tiếp nhận.' },
    wealth: { meaning: 'Ở chủ đề tài chính, Vũ Khúc gợi sự coi trọng số liệu, kỷ luật chi tiêu và việc theo dõi nguồn vào ra.', balance: 'Dành thời gian rà soát các khoản định kỳ để kế hoạch phản ánh tình hình thực tế.' },
    love: { meaning: 'Trong tình cảm, Vũ Khúc gợi cách thể hiện sự quan tâm qua hành động đáng tin và những cam kết cụ thể.', balance: 'Nói thêm về cảm xúc và kỳ vọng, không chỉ tập trung giải quyết việc trước mắt.' },
  },
  '天同': {
    overview: { meaning: 'Thiên Đồng tượng trưng cho sự hòa nhã, đồng cảm và mong muốn giữ môi trường tương tác dễ chịu.', balance: 'Nêu rõ điều mình cần ngay cả khi cuộc trò chuyện có thể không hoàn toàn thoải mái.' },
    career: { meaning: 'Trong công việc, Thiên Đồng gợi khả năng hợp tác mềm dẻo và chú ý đến bầu không khí trong nhóm.', balance: 'Chia nhỏ việc cần thay đổi thành bước cụ thể để vừa giữ sự hòa hợp vừa tiến triển.' },
    wealth: { meaning: 'Ở chủ đề tài chính, Thiên Đồng gợi sự coi trọng cảm giác an tâm và thoải mái trong cách sử dụng nguồn lực.', balance: 'Đặt giới hạn cho khoản chi tạo tiện nghi để các ưu tiên dài hạn vẫn được nhìn thấy.' },
    love: { meaning: 'Trong tình cảm, Thiên Đồng gợi sự dịu dàng, đồng cảm và mong muốn vun đắp cảm giác an toàn khi ở bên nhau.', balance: 'Chủ động bàn về những điều cần thay đổi thay vì chỉ giữ yên bề mặt.' },
  },
  '廉贞': {
    overview: { meaning: 'Liêm Trinh tượng trưng cho cá tính rõ nét, sự quan tâm đến nguyên tắc và nhu cầu xác định ranh giới.', balance: 'Tách điều mình coi trọng khỏi phản ứng nhất thời trước một bất đồng.' },
    career: { meaning: 'Trong công việc, Liêm Trinh gợi sự chú ý đến quy tắc, trách nhiệm và quyền hạn trong các mối phối hợp.', balance: 'Trao đổi ranh giới và kỳ vọng bằng ví dụ cụ thể, có thể kiểm chứng.' },
    wealth: { meaning: 'Ở chủ đề tài chính, Liêm Trinh gợi sự quan tâm đến nguyên tắc sử dụng nguồn lực và những giới hạn cần được tôn trọng.', balance: 'Viết rõ quy tắc chung cho các khoản chi để tránh quyết định theo cảm xúc tức thời.' },
    love: { meaning: 'Trong tình cảm, Liêm Trinh gợi nhu cầu về sự rõ ràng trong ranh giới, thỏa thuận và cách mỗi người thể hiện sự tôn trọng.', balance: 'Nói về giới hạn của mình mà vẫn dành chỗ để lắng nghe giới hạn của đối phương.' },
  },
  '天府': {
    overview: { meaning: 'Thiên Phủ tượng trưng cho năng lực gìn giữ, sắp xếp nguồn lực và tìm kiếm nền tảng ổn định.', balance: 'Đánh giá định kỳ điều gì còn hữu ích để sự thận trọng không ngăn việc điều chỉnh.' },
    career: { meaning: 'Trong công việc, Thiên Phủ gợi cách tổ chức nguồn lực, duy trì hoạt động và coi trọng nền tảng vận hành vững vàng.', balance: 'Chừa không gian thử cải tiến nhỏ bên cạnh việc bảo đảm quy trình hiện tại.' },
    wealth: { meaning: 'Ở chủ đề tài chính, Thiên Phủ gợi trọng tâm vào việc bảo toàn, sắp xếp và duy trì nguồn lực qua thời gian.', balance: 'Theo dõi khoản dự phòng và mục đích của từng khoản để biết nguồn lực đang phục vụ điều gì.' },
    love: { meaning: 'Trong tình cảm, Thiên Phủ gợi sự trân trọng nhịp điệu ổn định và những chăm sóc được duy trì đều đặn.', balance: 'Cùng làm mới cách gắn kết để sự quen thuộc vẫn đáp ứng nhu cầu hiện tại.' },
  },
  '太阴': {
    overview: { meaning: 'Thái Âm tượng trưng cho sự quan sát tinh tế, khả năng suy ngẫm và chú ý đến những nhu cầu ít được nói ra.', balance: 'Diễn đạt điều mình cảm nhận thành lời cụ thể để người khác có cơ hội hiểu đúng.' },
    career: { meaning: 'Trong công việc, Thái Âm gợi cách làm cẩn trọng, quan sát chi tiết và cân nhắc những yếu tố chưa bộc lộ rõ.', balance: 'Chia sẻ tiến độ và mối lo sớm để sự chuẩn bị kỹ không trở thành làm việc đơn độc.' },
    wealth: { meaning: 'Ở chủ đề tài chính, Thái Âm gợi sự chú ý đến an toàn, các khoản dự trữ và những nhu cầu cần được tính đến về lâu dài.', balance: 'Đưa các mục tiêu riêng tư vào kế hoạch chung thay vì chỉ giữ chúng trong suy nghĩ.' },
    love: { meaning: 'Trong tình cảm, Thái Âm gợi sự tinh tế với cảm xúc và nhu cầu về không gian để chia sẻ một cách chân thành.', balance: 'Nói rõ mong muốn thay vì chờ người kia tự nhận ra những tín hiệu kín đáo.' },
  },
  '贪狼': {
    overview: { meaning: 'Tham Lang tượng trưng cho sự ham tìm hiểu, khả năng giao tiếp và sức hút của nhiều trải nghiệm khác nhau.', balance: 'Chọn ưu tiên cho giai đoạn hiện tại để sự tò mò có chỗ phát triển đến nơi đến chốn.' },
    career: { meaning: 'Trong công việc, Tham Lang gợi sự linh hoạt trong giao tiếp, kết nối cơ hội và hứng thú với nhiều hướng phát triển.', balance: 'Chốt mục tiêu và giới hạn số việc đang theo đuổi cùng lúc.' },
    wealth: { meaning: 'Ở chủ đề tài chính, Tham Lang gợi sự quan tâm đến trải nghiệm, tiện ích và nhiều lựa chọn sử dụng nguồn lực.', balance: 'So sánh khoản chi với ưu tiên đã định trước khi bị cuốn theo điều hấp dẫn mới.' },
    love: { meaning: 'Trong tình cảm, Tham Lang gợi sự cởi mở với giao tiếp, hoạt động chung và những cách làm mới trải nghiệm của hai người.', balance: 'Thống nhất sự chú ý và thời gian dành cho nhau giữa nhiều mối quan tâm khác.' },
  },
  '巨门': {
    overview: { meaning: 'Cự Môn tượng trưng cho thói quen đặt câu hỏi, phân tích lời nói và muốn làm sáng tỏ điểm chưa thống nhất.', balance: 'Kiểm tra bằng chứng và chọn thời điểm phù hợp trước khi phản biện.' },
    career: { meaning: 'Trong công việc, Cự Môn gợi khả năng chất vấn giả định, diễn đạt lập luận và rà soát vấn đề qua trao đổi.', balance: 'Tập trung vào dữ kiện và giải pháp để bất đồng không che khuất mục tiêu chung.' },
    wealth: { meaning: 'Ở chủ đề tài chính, Cự Môn gợi việc muốn hiểu điều khoản, lý do và thông tin đằng sau mỗi lựa chọn nguồn lực.', balance: 'Đối chiếu các con số và điều kiện bằng văn bản trước khi thống nhất trách nhiệm.' },
    love: { meaning: 'Trong tình cảm, Cự Môn gợi nhu cầu trao đổi thẳng thắn để làm rõ khác biệt trong cách hiểu và kỳ vọng.', balance: 'Nghe hết ý rồi hỏi lại điều chưa rõ trước khi đáp trả.' },
  },
  '天相': {
    overview: { meaning: 'Thiên Tướng tượng trưng cho tinh thần hỗ trợ, sự công bằng và khả năng phối hợp giữa những nhu cầu khác nhau.', balance: 'Giữ quyền lựa chọn của mình khi giúp người khác giải quyết việc của họ.' },
    career: { meaning: 'Trong công việc, Thiên Tướng gợi khả năng kết nối vai trò, hỗ trợ cộng sự và chú ý đến cách quyết định được thực hiện công bằng.', balance: 'Xác định rõ phần trách nhiệm của từng người để hỗ trợ không thành gánh thay.' },
    wealth: { meaning: 'Ở chủ đề tài chính, Thiên Tướng gợi sự quan tâm đến phân chia nguồn lực hợp lý và các cam kết giữa những người liên quan.', balance: 'Thỏa thuận minh bạch về khoản đóng góp, quyền quyết định và cách rà soát.' },
    love: { meaning: 'Trong tình cảm, Thiên Tướng gợi mong muốn phối hợp, hỗ trợ qua lại và đối xử với nhau một cách tôn trọng.', balance: 'Hỏi xem người kia muốn được giúp thế nào và nói rõ giới hạn của mình.' },
  },
  '天梁': {
    overview: { meaning: 'Thiên Lương tượng trưng cho tinh thần bảo trợ, sự coi trọng nguyên tắc và việc học hỏi từ kinh nghiệm.', balance: 'Dùng kinh nghiệm làm gợi ý, không xem nó là khuôn duy nhất cho mọi hoàn cảnh.' },
    career: { meaning: 'Trong công việc, Thiên Lương gợi cách làm có trách nhiệm, chú trọng quy chuẩn và muốn truyền lại hiểu biết hữu ích.', balance: 'Để người khác tham gia chọn cách thực hiện thay vì chỉ áp dụng lối quen thuộc.' },
    wealth: { meaning: 'Ở chủ đề tài chính, Thiên Lương gợi sự quan tâm đến trách nhiệm lâu dài và việc giữ nguyên tắc khi dùng nguồn lực.', balance: 'Rà soát các nghĩa vụ thực tế và điều chỉnh kế hoạch khi hoàn cảnh thay đổi.' },
    love: { meaning: 'Trong tình cảm, Thiên Lương gợi sự quan tâm qua chăm sóc, lời khuyên và mong muốn bảo vệ những điều coi trọng.', balance: 'Hỏi xem đối phương cần được lắng nghe hay cần góp ý trước khi đưa lời khuyên.' },
  },
  '七杀': {
    overview: { meaning: 'Thất Sát tượng trưng cho tính độc lập, quyết đoán và sẵn sàng xử lý những việc đòi hỏi thay đổi nhanh.', balance: 'Dành thời gian ước lượng hệ quả và phương án dự phòng trước lựa chọn lớn.' },
    career: { meaning: 'Trong công việc, Thất Sát gợi cách tiếp cận trực diện, tự chủ và sẵn lòng nhận phần việc cần giải quyết dứt khoát.', balance: 'Kiểm tra nguồn lực, rủi ro và người cần phối hợp trước khi chốt hướng làm.' },
    wealth: { meaning: 'Ở chủ đề tài chính, Thất Sát gợi xu hướng muốn tự quyết và xử lý nhanh các vấn đề về nguồn lực.', balance: 'Tạm dừng để kiểm tra thông tin và giới hạn chịu đựng trước những quyết định quan trọng.' },
    love: { meaning: 'Trong tình cảm, Thất Sát gợi nhu cầu độc lập và cách xử lý thẳng vào vấn đề khi hai người cần thay đổi điều gì đó.', balance: 'Chừa thời gian cho đối thoại và cân nhắc cảm nhận của cả hai trước khi kết luận.' },
  },
  '破军': {
    overview: { meaning: 'Phá Quân tượng trưng cho khuynh hướng xem xét lại cấu trúc cũ, thử phương án mới và chấp nhận quá trình tái sắp xếp.', balance: 'Giữ lại điều vẫn có giá trị và chuẩn bị bước chuyển tiếp trước khi thay đổi.' },
    career: { meaning: 'Trong công việc, Phá Quân gợi sự quan tâm đến cải tổ quy trình và sẵn lòng thử cách làm khác khi cách cũ không còn phù hợp.', balance: 'Thử thay đổi theo phạm vi nhỏ, theo dõi kết quả và thống nhất cách quay lại nếu cần.' },
    wealth: { meaning: 'Ở chủ đề tài chính, Phá Quân gợi mong muốn sắp xếp lại cách sử dụng nguồn lực khi các ưu tiên hoặc điều kiện đã đổi.', balance: 'Xem xét hệ quả của việc thay đổi các cam kết trước khi chuyển nguồn lực sang mục đích mới.' },
    love: { meaning: 'Trong tình cảm, Phá Quân gợi nhu cầu làm mới cách tương tác khi nếp cũ không còn phù hợp với hai người.', balance: 'Thống nhất điều muốn đổi, điều muốn giữ và bước đầu tiên cả hai cùng chấp nhận.' },
  },
};

export const TOPIC_GUIDES: Record<DetailedTopic, { intro: string; questions: string[]; boundary: string }> = {
  overview: {
    intro: 'Phần tổng quan dùng biểu tượng các chính tinh để gợi một số cách bạn định hướng và tương tác với môi trường. Hãy xem đây là khung tự quan sát, rồi đối chiếu với trải nghiệm của chính mình.',
    questions: ['Cách làm nào thường giúp bạn bắt đầu một việc quan trọng?', 'Khi cần thay đổi kế hoạch, bạn thường cân nhắc điều gì trước?', 'Thói quen nào muốn giữ và thói quen nào muốn điều chỉnh?'],
    boundary: 'Phần này chỉ gợi suy ngẫm về lá số bản mệnh, không xác định sự kiện hay thời điểm trong đời.'
  },
  career: {
    intro: 'Chủ đề sự nghiệp tập trung vào phong cách tổ chức công việc, phối hợp và phát triển năng lực. Các biểu tượng có thể giúp bạn gọi tên ưu tiên, nhưng lựa chọn nghề nghiệp vẫn cần dựa trên kỹ năng, hoàn cảnh và thông tin thực tế.',
    questions: ['Môi trường làm việc nào giúp bạn phát huy cách làm tốt nhất?', 'Bạn muốn rèn thêm kỹ năng nào để xử lý công việc hiện tại?', 'Ranh giới trách nhiệm nào cần được trao đổi rõ hơn?'],
    boundary: 'Phần này chỉ gợi suy ngẫm về chủ đề công việc trong lá số bản mệnh, không dự báo chức vụ, thành bại hay thời điểm đổi việc.'
  },
  wealth: {
    intro: 'Chủ đề tài chính nhìn vào cách bạn suy nghĩ về nguồn lực, sự ổn định và việc sử dụng tiền bạc. Đây là dịp xem lại thói quen và ưu tiên cá nhân, không phải căn cứ cho quyết định tài chính.',
    questions: ['Điều gì khiến bạn cảm thấy nguồn lực của mình đang được quản lý rõ ràng?', 'Khoản chi hoặc cam kết nào cần được xem lại theo ưu tiên hiện tại?', 'Bạn muốn trao đổi minh bạch hơn với ai về trách nhiệm tài chính chung?'],
    boundary: 'Phần này chỉ gợi suy ngẫm về thái độ với nguồn lực trong lá số bản mệnh, không kết luận mức giàu nghèo hay hướng dẫn đầu tư.'
  },
  love: {
    intro: 'Chủ đề tình cảm gợi cách bạn trao đổi nhu cầu, xây dựng sự tin cậy và cùng điều chỉnh trong quan hệ đôi lứa. Hãy dùng các ý này để tự quan sát và đối thoại, không để biểu tượng thay cho sự hiểu biết giữa hai người.',
    questions: ['Bạn thường thể hiện sự quan tâm bằng cách nào?', 'Nhu cầu nào bạn muốn được nói rõ hơn trong một mối quan hệ?', 'Khi có bất đồng, điều gì giúp cuộc trò chuyện giữ được sự tôn trọng?'],
    boundary: 'Phần này chỉ gợi suy ngẫm về cách bạn xây dựng quan hệ trong lá số bản mệnh, không mô tả hay dự đoán đặc điểm của người phối ngẫu hoặc tương lai quan hệ.'
  },
};
