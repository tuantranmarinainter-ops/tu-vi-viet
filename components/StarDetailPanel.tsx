'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Star } from '@/lib/ziwei/types';
import { STAR_DESCRIPTIONS } from '@/lib/ziwei/constants';
import { viLabel } from '@/lib/i18n/vi';

interface StarDetailPanelProps {
  star: Star | null;
  palaceName?: string;
  onClose: () => void;
}

// 倪海厦体系各星详细解读（参考顾祥弘《飞星紫微斗数全书》及南北山人《紫微斗数全书》）
const STAR_DETAIL: Record<string, {
  niHaixia: string;
  classical: string;
  bestPalace: string;
  worstPalace: string;
  career: string;
  relationship: string;
  wealth: string;
  health: string;
}> = {
  '紫微': {
    niHaixia: 'Theo cách luận của Nghê Hải Hạ, Tử Vi được ví như sao đế tọa. Người có sao này ở cung Mệnh thường tự trọng, thích tự chủ và không muốn bị kiểm soát. Tả Phù, Hữu Bật hội chiếu được xem là yếu tố giúp cách cục phát huy; nếu thiếu trợ tinh thì có thể thành thế “đơn quân”, có danh vị nhưng khó đủ cả phú lẫn quý. Tử Vi tại Thìn hoặc Tuất được đánh giá cao; đồng cung Thiên Phủ tạo cách song tinh. Hỏa Tinh, Linh Tinh, Kình Dương, Đà La đồng cung được xem là bất lợi, dễ làm tăng tính cô độc và giảm tài lộc.',
    classical: 'Dịch ý cổ quyết: “Tử Vi như đế tọa, chủ sự tôn quý; người thủ Mệnh có uy quyền và danh vọng.” Chú giải Nam Bắc Sơn Nhân cho rằng Tử Vi thủ Mệnh tại Thìn có thể tốt về tài và quan; tại Tý thì phú quý khó bền.',
    bestPalace: 'Cung Mệnh (Thìn, Tuất), cung Quan Lộc',
    worstPalace: 'Cung Tật Ách, cung Phu Thê',
    career: 'Các lĩnh vực công quyền, quản lý hoặc khởi nghiệp độc lập; phù hợp vai trò lãnh đạo có quyền tự quyết.',
    relationship: 'Thường dè dặt trong tình cảm và có lòng tự trọng cao; cần sự chủ động từ đối phương. Kết hôn muộn được xem là thuận hơn.',
    wealth: 'Tài vận thiên về ổn định và tích lũy hơn mạo hiểm; Thìn, Tuất được cổ luận đánh giá tốt về tài và quan.',
    health: 'Ngũ hành Thổ; theo quan niệm này nên lưu ý hệ tiêu hóa và tránh làm việc quá sức, duy trì giờ giấc điều độ.',
  },
  '天机': {
    niHaixia: 'Thiên Cơ thường được gọi là sao mưu lược, tượng trưng cho trí óc nhanh nhạy và khả năng thích ứng. Theo lối luận này, người có Thiên Cơ ở Mệnh thường suy nghĩ linh hoạt nhưng dễ cân nhắc quá nhiều. Hóa Kỵ được xem là dấu hiệu cần thận trọng với việc suy tính quá mức. Sao thuộc hành Mộc; bản luận cũ khuyên người có cách này mở rộng môi trường sống và công việc để tìm cơ hội.',
    classical: 'Dịch ý cổ quyết: “Thiên Cơ thuộc Mộc, hợp việc tính toán và kinh doanh; người có sao này thường giỏi cơ mưu, có thể lập nghiệp xa quê.” Chú giải Nam Bắc Sơn Nhân nhấn mạnh sự sáng suốt khi sao ở vị trí thuận và khả năng hoạch định.',
    bestPalace: 'Cung Mệnh (Mão), cung Quan Lộc',
    worstPalace: 'Cung Phu Thê',
    career: 'Công nghệ, nghiên cứu, tư vấn, hoạch định và các nghề cần phân tích; phù hợp công việc dùng trí óc và khả năng thích ứng.',
    relationship: 'Dễ suy nghĩ nhiều và thay đổi ý định; nên trao đổi rõ ràng, kiên nhẫn xây dựng sự ổn định trong quan hệ.',
    wealth: 'Tài chính gắn với tri thức và kỹ năng chuyên môn; nên có kế hoạch quản lý tiền để duy trì sự ổn định.',
    health: 'Ngũ hành Mộc; nội dung luận cũ khuyên chú ý gan mật, hệ thần kinh, giấc ngủ và cân bằng thời gian nghỉ ngơi.',
  },
  '太阳': {
    niHaixia: 'Thái Dương tượng trưng cho sự quang minh, rộng rãi và hình tượng người cha, bậc trưởng thượng. Lối luận này xem sao ở Mão đến Ngọ là sáng rõ; sau Ngọ thì ánh sáng suy dần. Người có Thái Dương thủ Mệnh thường cởi mở, hào phóng và thích hoạt động trước công chúng. Phần luận cũ cũng lưu ý không nên biến các nhận xét về nam nữ thành kết luận cứng nhắc.',
    classical: 'Dịch ý cổ quyết: “Thái Dương ở Ngọ sáng rực, chủ danh vọng; khi suy yếu thì dễ vất vả.” Chú giải Nam Bắc Sơn Nhân đánh giá vị trí Ngọ thuận lợi cho tài và quan, đồng thời nhắc đến biến đổi theo vị trí và năm sinh.',
    bestPalace: 'Cung Mệnh (Mão đến Ngọ), cung Quan Lộc',
    worstPalace: 'Cung Phu Thê (theo luận cổ dành cho nữ mệnh), cung Tật Ách',
    career: 'Công vụ, quản lý, giáo dục, truyền thông và quan hệ công chúng; phù hợp vai trò thường xuyên giao tiếp hoặc làm việc trước công chúng.',
    relationship: 'Nên chú trọng lắng nghe và cân bằng nhu cầu độc lập với sự gắn kết; nội dung luận cũ nhấn mạnh việc chọn người biết cảm thông.',
    wealth: 'Tài vận được luận là dựa nhiều vào nỗ lực và sự rộng rãi; nên chủ động tích lũy, vì khả năng giữ tiền không phải lúc nào cũng mạnh.',
    health: 'Ngũ hành Hỏa; nội dung luận cũ khuyên chú ý tim mạch, mắt và nghỉ ngơi đầy đủ, nhất là khi làm việc quá sức.',
  },
  '武曲': {
    niHaixia: 'Vũ Khúc được xem là sao tài, có tính cương quyết và chịu khó. Người có sao này thủ Mệnh thường có ý chí và hợp với công việc tài chính, quản lý tiền bạc. Cách diễn giải cũ lưu ý sự thẳng thắn có thể gây va chạm trong quan hệ. Hóa Kỵ được xem là lúc cần thận trọng hơn. Vũ Khúc tại Thìn, Tuất, Sửu, Mùi hoặc đồng cung Thất Sát được cổ luận đánh giá cao về tài cách.',
    classical: 'Dịch ý cổ quyết: “Vũ Khúc thuộc Kim, tính cứng cỏi; thủ Mệnh ở vị trí thuận thì có thể nắm việc lớn.” Chú giải Nam Bắc Sơn Nhân cho rằng các cát tinh hội chiếu làm tăng cách cục tài quan; đồng cung Thất Sát được gọi là cách tướng tài.',
    bestPalace: 'Cung Mệnh (Thìn, Tuất, Sửu, Mùi), cung Tài Bạch, cung Quan Lộc',
    worstPalace: 'Cung Phu Thê',
    career: 'Tài chính, kế toán, kỹ thuật, quân đội hoặc công việc cần kỷ luật, thực thi và quyết đoán.',
    relationship: 'Cách giao tiếp có thể trực tiếp và ít lãng mạn; nên chủ động thể hiện sự quan tâm và lắng nghe đối phương.',
    wealth: 'Được luận là có năng lực kiếm và quản lý tiền; nên duy trì kế hoạch tài chính rõ ràng, thay vì chỉ dựa vào khả năng kiếm tiền.',
    health: 'Ngũ hành Kim; nội dung luận cũ khuyên chú ý phổi, hô hấp và răng. Đây là quan niệm tử vi, không thay cho tư vấn y tế.',
  },
  '天同': {
    niHaixia: 'Thiên Đồng được gọi là phúc tinh, tượng trưng cho sự an nhàn và nhu hòa. Người có sao này thủ Mệnh thường không thích cạnh tranh gay gắt và hợp môi trường ổn định. Đồng cung Thiên Lương được lối luận cũ xem là có thêm sự che chở. Hóa Lộc được đánh giá thuận lợi; khi gặp các yếu tố bất lợi thì nên xem toàn bộ cách cục, không kết luận chỉ từ một sao.',
    classical: 'Dịch ý cổ quyết: “Thiên Đồng là sao phúc, chủ đời sống an vui.” Chú giải Nam Bắc Sơn Nhân cho rằng khi không gặp sát tinh, sao này thiên về tính hòa nhã và cuộc sống đủ đầy.',
    bestPalace: 'Cung Mệnh, cung Phúc Đức',
    worstPalace: 'Cung Quan Lộc',
    career: 'Dịch vụ, nghệ thuật, ẩm thực và các môi trường làm việc ổn định, hợp tác; nên cân nhắc mức độ cạnh tranh của công việc.',
    relationship: 'Thường mềm mỏng và ít chủ động; trao đổi thẳng thắn về mong muốn sẽ giúp quan hệ cân bằng hơn.',
    wealth: 'Tài vận được luận là thiên về nguồn thu ổn định hơn đầu cơ; nên có kế hoạch tiết kiệm dài hạn.',
    health: 'Ngũ hành Thủy; nội dung luận cũ khuyên chú ý thận, bàng quang, vận động điều độ và nghỉ ngơi.',
  },
  '廉贞': {
    niHaixia: 'Liêm Trinh thường gắn với tài nghệ và sức hút tình cảm. Lối luận cũ cho rằng Hóa Kỵ cần được xem xét thận trọng vì có thể đi cùng tranh chấp hoặc biến cố; Liêm Trinh đồng cung Thiên Tướng được xem là cách cục thuận hơn về công việc hành chính. Sao thuộc hành Hỏa, được mô tả là cương trực và nhiều biến động. Đây là diễn giải truyền thống, không phải dự báo chắc chắn.',
    classical: 'Dịch ý cổ quyết: “Liêm Trinh chủ tài nghệ và tình cảm nhiều biến chuyển; đồng cung Thiên Tướng có thể chuyển bất lợi thành thuận lợi trong công việc.” Chú giải Nam Bắc Sơn Nhân lưu ý cần xét cát tinh, sát tinh và Hóa Kỵ cùng nhau.',
    bestPalace: 'Cung Quan Lộc (đồng cung Thiên Tướng), cung Mệnh (khi Hóa Lộc)',
    worstPalace: 'Cung Mệnh (khi Hóa Kỵ), cung Phu Thê',
    career: 'Nghệ thuật, giải trí, pháp luật hoặc công vụ; nên dựa trên chuyên môn và nguyên tắc nghề nghiệp.',
    relationship: 'Nội dung luận cũ mô tả sức hút tình cảm mạnh và quan hệ dễ phức tạp; giao tiếp rõ ràng giúp hạn chế hiểu lầm.',
    wealth: 'Tài chính có thể biến động theo công việc và năng lực chuyên môn; nên quản trị rủi ro và lưu ý điều khoản pháp lý.',
    health: 'Ngũ hành Hỏa; nội dung luận cũ nhắc đến tim mạch, máu huyết và gan. Hãy dựa vào chuyên gia y tế khi có vấn đề sức khỏe.',
  },
  '天府': {
    niHaixia: 'Thiên Phủ được ví như kho tài và có xu hướng giữ gìn thành quả. Người có sao này thủ Mệnh thường được mô tả là ổn định, thận trọng và coi trọng an toàn. Đồng cung hoặc hội chiếu Tử Vi được xem là cách song tinh; Không, Kiếp được cổ luận xem là yếu tố làm giảm khả năng tích lũy. Những nhận định này cần đặt trong toàn bộ lá số.',
    classical: 'Dịch ý cổ quyết: “Thiên Phủ là kho tài; thủ Mệnh thiên về ổn định và tích lũy.” Chú giải Nam Bắc Sơn Nhân cho rằng cát tinh hội tụ giúp cách cục tài quan thêm thuận, còn Không Kiếp là yếu tố cần lưu ý.',
    bestPalace: 'Cung Mệnh, cung Tài Bạch, cung Điền Trạch',
    worstPalace: 'Cung Thiên Di',
    career: 'Quản trị, tài chính, bảo hiểm, bất động sản và công việc cần tính ổn định; phù hợp cách làm có kế hoạch.',
    relationship: 'Được mô tả là coi trọng gia đình và sự an toàn; nên chia sẻ nhu cầu và trách nhiệm với bạn đời.',
    wealth: 'Lối luận truyền thống đánh giá khả năng giữ tiền và tích lũy; quyết định đầu tư vẫn cần dựa trên hoàn cảnh thực tế.',
    health: 'Ngũ hành Thổ; nội dung luận cũ khuyên chú ý tiêu hóa và duy trì giờ ăn, sinh hoạt đều đặn.',
  },
  '太阴': {
    niHaixia: 'Thái Âm tượng trưng cho tài lộc, sự tinh tế và đời sống nội tâm; trong lối luận truyền thống còn gắn với hình tượng người mẹ. Sao ở Hợi, Tý được đánh giá sáng; ở vị trí suy thì tài vận được cho là kém thuận hơn. Hóa Kỵ được nhắc như yếu tố cần xem xét trong quan hệ với nữ giới trong gia đình. Đây là quan niệm cổ, không phải kết luận về giới tính hay sức khỏe.',
    classical: 'Dịch ý cổ quyết: “Thái Âm là sao tài; tại Hợi, Tý thì sáng rõ, ở Ngọ thì suy yếu hơn.” Chú giải Nam Bắc Sơn Nhân liên hệ vị trí sáng với tài lộc và sự tinh tế trong cảm xúc.',
    bestPalace: 'Cung Mệnh (Hợi, Tý), cung Tài Bạch',
    worstPalace: 'Cung Mệnh (khi ở Ngọ và suy yếu)',
    career: 'Tài chính, bất động sản, nghệ thuật, giáo dục và công việc cần sự tỉ mỉ, kiên nhẫn hoặc cảm quan thẩm mỹ.',
    relationship: 'Thường coi trọng sự an toàn và cảm xúc sâu sắc; trao đổi chân thành giúp xây dựng sự tin cậy.',
    wealth: 'Lối luận truyền thống xem vị trí sáng là thuận lợi cho tài lộc; vẫn nên ưu tiên quản lý tiền cẩn trọng và tránh đầu tư theo cảm tính.',
    health: 'Ngũ hành Thủy; nội dung luận cũ nhắc đến thận và hệ tiết niệu. Triệu chứng sức khỏe cần được đánh giá bởi nhân viên y tế.',
  },
  '贪狼': {
    niHaixia: 'Tham Lang thường được mô tả là đa tài và có sức hút xã hội. Hóa Lộc được xem là yếu tố tăng thuận lợi về giao tiếp, nghề nghiệp và tài lộc; Không, Kiếp được xem là dấu hiệu cần thận trọng trong việc tích lũy. Một số cách luận cho rằng thành tựu đến muộn hơn. Đây là diễn giải truyền thống, không khẳng định diễn biến tương lai.',
    classical: 'Dịch ý cổ quyết: “Tham Lang đa tài, có duyên giao tiếp; có người phát triển muộn.” Chú giải Nam Bắc Sơn Nhân khuyên kết hợp việc xét sao với cách tu dưỡng và các yếu tố hội chiếu.',
    bestPalace: 'Cung Mệnh (khi Hóa Lộc), cung Phúc Đức, cung Thiên Di',
    worstPalace: 'Cung Tật Ách',
    career: 'Nghệ thuật, giải trí, bán hàng, quan hệ công chúng và công việc tận dụng năng khiếu hoặc mạng lưới quan hệ.',
    relationship: 'Có thể coi trọng giao tiếp và sự mới mẻ; nên thống nhất ranh giới và kỳ vọng trong mối quan hệ.',
    wealth: 'Tài lộc được luận là gắn với kỹ năng và quan hệ; nên xây dựng kế hoạch tài chính dài hạn, nhất là khi thu nhập biến động.',
    health: 'Ngũ hành Mộc, có liên hệ Thủy trong một số cách luận; nội dung cũ nhắc đến gan, thận và cân bằng sức lực.',
  },
  '巨门': {
    niHaixia: 'Cự Môn gắn với lời nói và tranh luận. Hóa Lộc, Hóa Quyền được xem là giúp chuyển năng lực ngôn ngữ thành lợi thế nghề nghiệp; Hóa Kỵ được coi là lúc cần cẩn trọng hơn với tranh cãi và phát ngôn. Người có sao này thủ Mệnh thường được mô tả là giỏi biện luận nhưng dễ nghi ngờ. Các nhận định này không thay thế đánh giá cá nhân.',
    classical: 'Dịch ý cổ quyết: “Cự Môn chủ lời nói và thị phi; khi gặp Lộc, Quyền thì có thể dùng lời nói làm nghề.” Chú giải Nam Bắc Sơn Nhân nhấn mạnh sự thận trọng trong ngôn từ khi gặp Hóa Kỵ.',
    bestPalace: 'Cung Quan Lộc (khi Hóa Lộc hoặc Hóa Quyền), cung Mệnh (Tý, Ngọ)',
    worstPalace: 'Cung Phu Thê, cung Tật Ách (khi Hóa Kỵ)',
    career: 'Luật, giảng dạy, bán hàng, dẫn chương trình, đàm phán và các nghề cần giao tiếp rõ ràng.',
    relationship: 'Nên tránh suy diễn và ưu tiên trao đổi trực tiếp, kiên nhẫn; sự lắng nghe có thể giúp giảm hiểu lầm.',
    wealth: 'Thu nhập được luận là có thể gắn với kỹ năng giao tiếp và chuyên môn; nên kiểm tra kỹ thỏa thuận để hạn chế tranh chấp.',
    health: 'Ngũ hành Thủy; nội dung luận cũ nhắc đến thận, tai và khoang miệng. Vấn đề sức khỏe cần hỏi nhân viên y tế.',
  },
  '天相': {
    niHaixia: 'Thiên Tướng được ví với ấn tín và công việc điều phối. Người có sao này thủ Mệnh thường được mô tả là ngay thẳng, hợp vai trò hỗ trợ hoặc quản lý hành chính. Cổ luận cho rằng Liêm Trinh đồng cung giúp tăng quyền hạn, còn đồng cung Phá Quân tạo cách cục cần xét thận trọng. Không nên kết luận chỉ dựa vào một tổ hợp sao.',
    classical: 'Dịch ý cổ quyết: “Thiên Tướng chủ việc hành chính và điều phối; đồng cung Liêm Trinh có thể đảm nhiệm quyền trách.” Chú giải Nam Bắc Sơn Nhân mô tả Thiên Tướng là ngay thẳng; tổ hợp với Phá Quân cần xét thêm toàn cục.',
    bestPalace: 'Cung Quan Lộc, cung Mệnh (đồng cung Liêm Trinh)',
    worstPalace: 'Cung Tài Bạch, cung Mệnh (đồng cung Phá Quân)',
    career: 'Công vụ, quản trị, hành chính, thư ký hoặc trợ lý; phù hợp vai trò tổ chức và hỗ trợ đội nhóm.',
    relationship: 'Thường coi trọng sự ổn định và tin cậy; nên trao đổi rõ về mục tiêu chung và cách phân chia trách nhiệm.',
    wealth: 'Tài chính được luận là ổn định theo thu nhập; nên ưu tiên tích lũy và đánh giá rủi ro trước khi đầu tư.',
    health: 'Ngũ hành Thủy; nội dung luận cũ nhắc đến thận và hệ bạch huyết. Đây không phải chẩn đoán y khoa.',
  },
  '天梁': {
    niHaixia: 'Thiên Lương được gọi là sao che chở, gắn với người lớn tuổi, y dược và tôn giáo trong cách luận truyền thống. Người có sao này thủ Mệnh thường được mô tả là coi trọng việc giúp đỡ người khác. Hóa Kỵ được xem là yếu tố cần lưu ý; đồng cung Thái Dương được một số sách đánh giá thuận lợi. Đây là biểu tượng luận đoán, không phải tiên đoán sức khỏe hay tuổi thọ.',
    classical: 'Dịch ý cổ quyết: “Thiên Lương chủ che chở; người thủ Mệnh thường có duyên với bậc trưởng thượng.” Chú giải Nam Bắc Sơn Nhân cho rằng cát tinh hội tụ hoặc đồng cung Thái Dương làm tăng ý nghĩa thuận lợi.',
    bestPalace: 'Cung Mệnh, cung Phụ Mẫu, cung Phúc Đức',
    worstPalace: 'Cung Mệnh (khi Hóa Kỵ), cung Tài Bạch',
    career: 'Y tế, pháp luật, công tác xã hội, giáo dục hoặc hoạt động cộng đồng; phù hợp công việc có ích cho người khác.',
    relationship: 'Một số cách luận cho rằng duyên tình có thể đến muộn; xây dựng quan hệ dựa trên kiên nhẫn và sự tương trợ.',
    wealth: 'Tài vận được luận là có sự hỗ trợ từ người khác; nên chủ động lập kế hoạch thay vì dựa hoàn toàn vào may mắn.',
    health: 'Ngũ hành Thổ; nội dung luận cũ nhắc đến tiêu hóa và xương khớp. Khuyến nghị sức khỏe cần dựa trên chuyên gia y tế.',
  },
  '七杀': {
    niHaixia: 'Thất Sát được ví như sao tướng, tượng trưng cho sự quyết đoán và tinh thần hành động. Người có sao này thủ Mệnh thường được mô tả là mạnh mẽ, độc lập; cát tinh hội chiếu được xem là giúp cân bằng. Đồng cung Vũ Khúc được cổ luận gọi là cách tướng tài. Các tổ hợp sát tinh cần được đánh giá trong toàn lá số, không nên xem như dự báo tai họa.',
    classical: 'Dịch ý cổ quyết: “Thất Sát như tướng tinh, quyết đoán và có khí thế; thủ Mệnh cần xét các sao hội chiếu.” Chú giải Nam Bắc Sơn Nhân nhấn mạnh vai trò của cát tinh và cảnh báo không nên tách riêng tổ hợp sát tinh khỏi toàn cục.',
    bestPalace: 'Cung Mệnh (khi có trợ tinh), cung Quan Lộc',
    worstPalace: 'Cung Phu Thê, cung Phụ Mẫu',
    career: 'Quản lý, khởi nghiệp, quân đội hoặc lĩnh vực cần ra quyết định; nên cân bằng sự quyết đoán với đánh giá rủi ro.',
    relationship: 'Có thể thiên về độc lập và mạnh mẽ; cần tôn trọng khác biệt và trao đổi về nhu cầu của mỗi người.',
    wealth: 'Tài chính được luận là có thể biến động; nên đa dạng hóa và tránh quyết định vội. Đồng cung Vũ Khúc được cổ luận đánh giá cao.',
    health: 'Ngũ hành Kim; nội dung luận cũ nhắc đến phổi, ruột già và việc điều tiết căng thẳng. Đây không phải tư vấn y khoa.',
  },
  '破军': {
    niHaixia: 'Phá Quân tượng trưng cho việc phá bỏ cái cũ và mở đường đổi mới. Người có sao này thủ Mệnh thường được mô tả là thích khai phá, nhưng cuộc sống có thể nhiều thay đổi. Hóa Lộc được cổ luận xem là yếu tố hỗ trợ việc xây dựng lại sau biến động. Những nhận xét về quan hệ thân tộc hoặc tương lai là quan niệm truyền thống, không phải kết luận chắc chắn.',
    classical: 'Dịch ý cổ quyết: “Phá Quân chủ đổi mới; sau khi phá bỏ có thể dựng xây lại.” Chú giải Nam Bắc Sơn Nhân nhắc rằng đời sống có thể trải qua biến động và cần xét Hóa Lộc cùng các yếu tố hội chiếu.',
    bestPalace: 'Cung Quan Lộc (khi Hóa Lộc), cung Thiên Di',
    worstPalace: 'Cung Phu Thê, cung Phụ Mẫu',
    career: 'Đổi mới, khởi nghiệp, quản lý chuyển đổi và công việc mở ra lĩnh vực mới; nên chuẩn bị kế hoạch cho những thay đổi.',
    relationship: 'Quan hệ có thể trải qua nhiều thay đổi; sự độc lập cần đi cùng cam kết và trao đổi rõ ràng.',
    wealth: 'Tài chính được luận là biến động; lập quỹ dự phòng và đánh giá kỹ kế hoạch trước khi thay đổi lớn.',
    health: 'Ngũ hành Thủy; nội dung luận cũ nhắc đến thận, bàng quang và hệ sinh dục. Hãy tìm tư vấn y tế khi cần.',
  },
};

const levelConfig = {
  major: { label: 'Chính tinh', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  lucky: { label: 'Cát tinh', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
  sha:   { label: 'Sát tinh', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  minor: { label: 'Tạp diệu', color: 'text-slate-400 border-slate-500/25 bg-slate-500/10' },
};

const siHuaColors: Record<string, string> = {
  '禄': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  '权': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  '科': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  '忌': 'text-red-400 bg-red-500/10 border-red-500/30',
};

function displayVi(text: string, fallback: string): string {
  const translated = viLabel(text);
  return /[\u3400-\u9fff]/.test(translated) ? fallback : translated;
}

export default function StarDetailPanel({ star, palaceName, onClose }: StarDetailPanelProps) {
  const desc = star ? STAR_DESCRIPTIONS[star.name] : null;
  const detail = star ? STAR_DETAIL[star.name] : null;
  const typeConfig = star ? levelConfig[star.type] : null;

  return (
    <AnimatePresence>
      {star && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="card-glass rounded-xl overflow-hidden"
        >
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--t-border)' }}>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold" style={{ color: 'var(--t-gold)' }}>{displayVi(star.name, 'Tên sao chưa có bản dịch')}</span>
              {typeConfig && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
              )}
              {star.siHua && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${siHuaColors[star.siHua] || ''}`}>
                  Hóa {viLabel(star.siHua)}
                </span>
              )}
            </div>
            <button onClick={onClose} className="transition-colors text-lg leading-none" style={{ color: 'var(--t-faint)' }}>×</button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto max-h-[560px]">
            {/* 基本信息 */}
            {desc && (
              <div className="flex flex-wrap gap-1.5">
                {[
                  `Ngũ hành · ${viLabel(desc.element)}`,
                  `Tính chất · ${viLabel(desc.nature)}`,
                  ...(palaceName ? [`Vị trí · ${displayVi(palaceName, 'Cung chưa có bản dịch')}`] : []),
                  ...(star.brightness ? [star.brightness === 'bright' ? 'Miếu Vượng' : star.brightness === 'dim' ? 'Lạc Hãm' : 'Bình hòa'] : []),
                ].map(tag => (
                  <div key={tag} className="text-[10px] px-2 py-1 rounded-full"
                    style={{
                      border: '1px solid var(--t-border)',
                      color: tag.includes('Miếu Vượng') ? '#eab308' : tag.includes('Lạc Hãm') ? '#ef4444' : 'var(--t-text2)',
                    }}>
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {/* 关键词 */}
            {desc && (
              <div>
                <div className="text-[10px] tracking-widest mb-1.5" style={{ color: 'var(--t-faint)' }}>Đặc tính sao</div>
                <div className="flex flex-wrap gap-1.5">
                  {desc.keywords.split('·').map(k => (
                    <span key={k} className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{ color: 'var(--t-gold)', border: '1px solid rgba(212,168,67,0.2)', background: 'rgba(212,168,67,0.06)' }}>
                      {displayVi(k.trim(), 'Thuật ngữ chưa có bản dịch')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 古书原文 */}
            {detail && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.12)' }}>
                <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1" style={{ color: 'var(--t-gold)', opacity: 0.7 }}>
                  Dịch ý từ cổ luận
                </div>
                <p className="text-[11px] leading-relaxed italic" style={{ color: 'var(--t-gold)', opacity: 0.8 }}>{detail.classical}</p>
              </div>
            )}

            {/* 倪海厦解读 */}
            {detail && (
              <>
                <div>
                  <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--t-faint)' }}>
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                    Luận giải của thầy Nghê Hải Hạ
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>{detail.niHaixia}</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'Hướng sự nghiệp', value: detail.career, icon: '◈' },
                    { label: 'Đặc điểm tình cảm', value: detail.relationship, icon: '♡' },
                    { label: 'Tài vận', value: detail.wealth, icon: '◆' },
                    { label: 'Lưu ý sức khỏe', value: detail.health, icon: '☯' },
                  ].map(item => (
                    <div key={item.label} className="card-inner rounded-lg p-3">
                      <div className="text-[10px] mb-1 flex items-center gap-1" style={{ color: 'var(--t-faint)' }}>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(74,222,128,0.15)', background: 'rgba(74,222,128,0.05)' }}>
                    <div className="text-emerald-500 mb-0.5 font-medium">Cung phù hợp</div>
                    <div className="text-emerald-500/70">{displayVi(detail.bestPalace, 'Chưa có dữ liệu tiếng Việt')}</div>
                  </div>
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(248,113,113,0.15)', background: 'rgba(248,113,113,0.05)' }}>
                    <div className="text-red-500 mb-0.5 font-medium">Cung cần lưu ý</div>
                    <div className="text-red-500/70">{displayVi(detail.worstPalace, 'Chưa có dữ liệu tiếng Việt')}</div>
                  </div>
                </div>
              </>
            )}

            {/* 辅星/煞星说明 */}
            {!detail && star.type !== 'major' && (
              <div className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>
                {star.type === 'lucky' && (
                  <>
                    {star.name === '文昌' && 'Văn Xương ở cung này được luận là thuận cho học tập, thi cử và công việc giấy tờ, ngôn từ.'}
                    {star.name === '文曲' && 'Văn Khúc ở cung này được luận là thiên về tài nghệ, khả năng diễn đạt và năng khiếu nghệ thuật.'}
                    {star.name === '左辅' && 'Tả Phù ở cung này tượng trưng cho sự hỗ trợ, giúp đỡ và quý nhân theo cách luận truyền thống.'}
                    {star.name === '右弼' && 'Hữu Bật ở cung này tượng trưng cho sự trợ giúp và hỗ trợ kín đáo theo cách luận truyền thống.'}
                    {star.name === '天魁' && 'Thiên Khôi ở cung này được luận là dấu hiệu có sự nâng đỡ, đặc biệt từ người có kinh nghiệm hoặc vị thế.'}
                    {star.name === '天钺' && 'Thiên Việt ở cung này được luận là dấu hiệu có sự trợ giúp và thuận lợi từ các mối quan hệ.'}
                    {star.name === '禄存' && 'Lộc Tồn ở cung này được luận là thiên về gìn giữ tài lộc và tích lũy thận trọng.'}
                    {star.name === '天马' && 'Thiên Mã ở cung này được luận là gắn với dịch chuyển, thay đổi và tìm cơ hội qua hoạt động.'}
                  </>
                )}
                {star.type === 'sha' && (
                  <>
                    {star.name === '地空' && 'Địa Không ở cung này được luận là cảm giác hụt hẫng hoặc khó tập trung; nên quan tâm đến trạng thái tinh thần và nghỉ ngơi.'}
                    {star.name === '地劫' && 'Địa Kiếp ở cung này được luận là yếu tố bất ổn; nên thận trọng với tài sản và các quyết định quan trọng.'}
                    {star.name === '火星' && 'Hỏa Tinh ở cung này được luận là dễ làm tăng sự nóng vội; nên cân nhắc kỹ trước khi hành động.'}
                    {star.name === '铃星' && 'Linh Tinh ở cung này được luận là có thể gặp trở ngại khó thấy; nên làm việc cẩn trọng và trao đổi rõ ràng.'}
                    {star.name === '擎羊' && 'Kình Dương ở cung này được luận là làm tăng tính va chạm; nên kiên nhẫn và chú ý an toàn trong sinh hoạt.'}
                    {star.name === '陀罗' && 'Đà La ở cung này được luận là dễ kéo dài việc hoặc vướng bất đồng; nên chia nhỏ công việc và chuẩn bị sớm.'}
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
