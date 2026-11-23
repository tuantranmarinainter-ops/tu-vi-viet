/**
 * Bản tiếng Việt của `lib/ziwei/heming-knowledge.ts`.
 * Nguồn: Renhuai123/ziwei-doushu (bản 39c0abd, 21/11/2026), giấy phép MIT.
 * https://github.com/Renhuai123/ziwei-doushu/blob/39c0abd/lib/ziwei/heming-knowledge.ts
 * Chỉ dịch chuỗi hiển thị; khóa (tên sao, tên hóa, số sao đánh giá) giữ nguyên tiếng Trung.
 *
 * 紫微斗数合盘知识库
 * 基于倪海厦《天纪》体系 + 《紫微斗数全书》古典断语 + 全网专业资料整合
 * 供合盘 AI 分析使用
 */

// ─── 十四主星在夫妻宫的完整断语 ──────────────────────────

export const STAR_IN_FUQI_GU: Record<string, {
  summary: string;       // 一句话核心
  good: string;          // 吉象条件/表现
  bad: string;           // 凶象/注意事项
  spouse_traits: string; // 配偶外形性格
  timing: string;        // 婚期建议
  ni_quote?: string;     // 倪海厦原话
}> = {
  '紫微': {
    summary: 'Người phối ngẫu kiêu hãnh, giỏi giang; nên kết hôn muộn, tình cảm lấy sự tôn trọng làm nền',
    good: 'Tam phương có Phụ Bật giáp: người phối ngẫu hiền tài, sau cưới được quý nhân giúp; tam hợp gặp Lộc chủ tiền tài và lộc đều đủ',
    bad: 'Vua cô độc không có phò tá: người phối ngẫu mạnh mẽ, khó trao đổi; ở cung Thìn, Tuất thì tình nghĩa vợ chồng nhạt; hội Phá Quân: trước khi cưới nhiều trở ngại',
    spouse_traits: 'Người phối ngẫu khí chất kiêu hãnh, có chính kiến, lòng tự trọng cao, năng lực mạnh nhưng không dễ bày tỏ tình cảm',
    timing: 'Nên cưới muộn (nam trên 30, nữ trên 27); cưới sớm nhiều trắc trở',
    ni_quote: 'Tử Vi ở cung Phu Thê là cô khắc, nên cưới muộn; tình cảm tốt nhưng tốn công trao đổi',
  },
  '天机': {
    summary: 'Hôn nhân nhiều biến đổi; nên chọn người phối ngẫu chênh lệch tuổi nhiều',
    good: 'Gặp Lộc Tồn hoặc Hóa Lộc: tình cảm còn giữ được; hội Thái Âm: thêm tinh tế dịu dàng',
    bad: 'Hóa Kỵ hoặc hội sát: tình cảm biến động lớn, dễ chia lìa; Thiên Cơ hay đổi, người phối ngẫu do dự trong tình cảm',
    spouse_traits: 'Người phối ngẫu thông minh hay thay đổi, tâm tư tinh tế, có duyên sâu với tôn giáo triết học, hơi dễ căng thẳng thần kinh',
    timing: 'Nên chênh tuổi nhiều (từ 6 tuổi trở lên), có thể giảm xung đột do cả hai đều hay thay đổi',
    ni_quote: 'Thiên Cơ hay đổi, không nên độc tọa; hôn nhân đầy biến đổi',
  },
  '太阳': {
    summary: 'Mệnh nam được giúp từ vợ, mệnh nữ vượng phu; lạc hãm Hóa Kỵ thì ngược lại chủ hình khắc',
    good: 'Miếu vượng (từ cung Mão đến cung Thân): người phối ngẫu giỏi giang, mệnh nam có vợ hiền giúp; mệnh nữ lấy chồng vượng, hôn nhân mỹ mãn',
    bad: 'Lạc hãm (từ cung Dậu đến cung Dần): mệnh nam vợ ốm yếu, mệnh nữ lấy chồng tầm thường; Hóa Kỵ: mệnh nữ “trên không thấy cha, dưới không thấy con, giữa không thấy chồng”, mười năm ấy chồng gặp tai nạn lớn',
    spouse_traits: 'Người phối ngẫu cởi mở rộng rãi, có ý thức về hình ảnh trước công chúng, hào phóng nhưng đôi khi quá mạnh mẽ',
    timing: 'Diễn tiến tình cảm đầu nóng sau lạnh; nên giữ khoảng cách vừa phải để duy trì cảm giác mới mẻ',
    ni_quote: 'Thái Dương Hóa Kỵ, trên không thấy cha, dưới không thấy con, giữa không thấy chồng — mệnh nữ mười năm ấy chồng ắt có tai họa lớn',
  },
  '武曲': {
    summary: 'Sao quả tú, hôn nhân hình khắc, đều nên cưới muộn',
    good: 'Vũ Khúc Hóa Lộc: người phối ngẫu có năng lực kiếm tiền, nhưng mệnh nam lại chê vợ quá giỏi; gặp Lộc Tồn giáp phò: hôn nhân vững, có tiền',
    bad: 'Hóa Kỵ: cô quả, khó lấy vợ lấy chồng, hoặc người phối ngẫu có khuyết tật; Vũ Khúc Thất Sát (cung Mão, Dậu): điềm hôn nhân rất xấu; gặp bất kỳ sao nào trong tứ sát: chủ ly hôn; Vũ Khúc Phá Quân: gặp sát, Kỵ, sao hình thì hôn nhân ắt bất lợi',
    spouse_traits: 'Người phối ngẫu cương liệt độc lập, nói thẳng, không giỏi bày tỏ tình cảm, năng lực kinh tế mạnh nhưng tính khá cô khắc',
    timing: 'Nhóm Vũ Khúc đều khuyên cưới sau 30 tuổi; cưới sớm tan sớm',
    ni_quote: 'Vũ Khúc Hóa Kỵ là sao hình tù; nhóm Vũ Khúc hôn nhân nên muộn',
  },
  '天同': {
    summary: 'Người phối ngẫu ôn hòa, thích hưởng thụ; nên chênh tuổi nhiều, cưới muộn là tốt',
    good: 'Gặp Lộc Tồn hoặc Hóa Lộc: người phối ngẫu ôn hòa mang theo tiền, gia đình yên ổn; cùng Thái Âm: tình cảm dịu dàng ngọt ngào',
    bad: 'Hóa Kỵ: tình cảm lúc đầu còn được, dần dần nhạt đi, vì không dung hòa được mà sinh oán trách; gặp nhiều sát: sự lười nhác trở thành gánh nặng',
    spouse_traits: 'Người phối ngẫu ôn hòa lương thiện, lạc quan dễ chịu, nhưng có thể lười nhác, thiên về hưởng thụ',
    timing: 'Nam lấy vợ nhỏ tuổi hơn, nữ lấy chồng lớn tuổi hơn; chênh từ 8 tuổi trở lên là duyên kết tóc tốt nhất',
  },
  '廉贞': {
    summary: 'Chính tinh kém ổn định nhất ở cung Phu Thê, nguy cơ sinh ly tử biệt cao',
    good: 'Liêm Trinh Thiên Phủ (Tý, Ngọ): người phối ngẫu ôn hòa thanh tú, tình cảm còn được, phần nhiều là người làm công ăn lương',
    bad: 'Liêm Trinh Tham Lang: không sinh ly thì tử biệt; Liêm Trinh Phá Quân: làm mộ dưới nước; Liêm Trinh Thất Sát: chôn thây giữa đường; Hóa Kỵ: tình cảm bị quấy nhiễu không dứt, làm lành rồi đổ vỡ lặp lại; đồng cung với Hỏa Tinh: dù có cát tinh cũng ở riêng',
    spouse_traits: 'Người phối ngẫu ngoại hình nổi bật, giỏi giao tiếp, mang lại nhiều giá trị cảm xúc, nhưng không ổn định; có thể xa nhiều gần ít',
    timing: 'Mệnh nam nên lấy vợ trẻ (trẻ hơn 6–12 tuổi), mệnh nữ nên lấy chồng lớn tuổi',
    ni_quote: 'Liêm Trinh Tham Lang/Liêm Trinh Phá Quân ở cung Phu Thê, bất kể mệnh nam hay nữ, không sinh ly thì tử biệt; Liêm Trinh Thất Sát — chôn thây giữa đường; Liêm Trinh Phá Quân — làm mộ dưới nước; Liêm Trinh Tham Lang — hoạnh yểu (chết yểu)',
  },
  '天府': {
    summary: 'Sao lành, chủ sinh ly chứ không tử biệt; tình cảm bình ổn nhưng nhạt',
    good: 'Gặp Lộc Tồn hoặc Hóa Lộc: tiền lộc đều đủ, tình cảm ổn định; tam phương không có sát: vợ chồng êm ấm hòa thuận',
    bad: 'Chỉ có một trong Phụ Bật: dễ có cuộc hôn nhân thứ hai; gặp tứ sát: tình cảm lạnh nhạt, khả năng sinh ly tăng',
    spouse_traits: 'Người phối ngẫu nho nhã lịch sự, sở thích rộng, giữ tiền có nguyên tắc, làm việc giỏi, nhưng thiên về bảo thủ',
    timing: 'Mệnh nam người phối ngẫu lớn tuổi hơn, mệnh nữ người phối ngẫu nhỏ tuổi hơn; tình cảm ổn định nhưng cần chủ động vun đắp',
  },
  '太阴': {
    summary: 'Hợp người phối ngẫu thanh tú dịu dàng; lạc hãm thêm sát thì tình cảm nhiều biến đổi',
    good: 'Miếu vượng (từ Tý đến Ngọ) gặp cát: người phối ngẫu thanh tú, có thành tựu, mệnh nam vợ đẹp; mệnh nữ: bản thân thanh tú có khí chất',
    bad: 'Lạc hãm (từ Mùi đến Hợi): tình cảm dễ đổi, sức khỏe người phối ngẫu kém; Hóa Kỵ (mệnh nam càng kỵ): mẹ chồng nàng dâu bất hòa, vợ và mẹ ắt xung đột; gặp Hỏa Linh: tình cảm có biến cố lớn',
    spouse_traits: 'Người phối ngẫu dịu dàng thanh tú, tinh tế nhạy cảm, trọng tình cảm, nhưng đôi khi cảm tính',
    timing: 'Không có ràng buộc riêng, nhưng khi lạc hãm thì nên cưới muộn',
    ni_quote: 'Mệnh của đàn ông sợ nhất Thái Âm Hóa Kỵ: mẹ chồng nàng dâu bất hòa, vợ với mẹ nhất định không hợp',
  },
  '贪狼': {
    summary: 'Đào hoa vượng nhất, hôn nhân không ổn định, nguy cơ ngoại tình cao',
    good: 'Hóa Lộc: người phối ngẫu nhiều tài nghệ, đầy phong tình, tình cảm ngọt ngào (nhưng nguy cơ ngoại tình không giảm); gặp Hóa Khoa: giảm ngoại tình',
    bad: 'Hóa Kỵ: nhiều khả năng có hôn nhân lần hai; Tử Vi Tham Lang (Mão, Dậu): người phối ngẫu hay đi ngoài, có điềm ngoại tình; gặp tứ sát: ắt sinh ly; Tham Lang ở cung Ngọ (sao võ quan): ngược lại chủ người phối ngẫu làm võ chức, khá ổn định',
    spouse_traits: 'Người phối ngẫu tài nghệ hơn người, giao tiếp giỏi, rất có duyên với người khác giới, nhưng ham muốn mạnh, khó ràng buộc',
    timing: 'Cưới sớm tình cảm nhiều biến đổi, nên cưới muộn; trước khi cưới nhất định phải tìm hiểu các mối quan hệ khác giới của đối phương',
    ni_quote: 'Tham Lang ngoài chỉ sao đào hoa, còn chỉ tửu sắc tài khí cờ bạc, tất cả đều nằm trong Tham Lang; Tham Lang ở cung Ngọ là sao võ quan, đừng tùy tiện phê là đào hoa',
  },
  '巨门': {
    summary: 'Nhiều khẩu thiệt thị phi, vợ chồng dễ cãi nhau, cần Thái Dương hóa giải',
    good: 'Hội Thái Dương miếu vượng: ngược lại chủ hôn nhân hòa đẹp, tài ăn nói thành lợi khí giao tiếp; Hóa Lộc: vợ hiền giỏi, đường tiền nhờ vợ mà mở',
    bad: 'Hóa Kỵ: người phối ngẫu hay cằn nhằn, thị phi không dứt; Đà La đồng độ: vợ chồng tự chuốc phiền não; độc thủ không có cát: tình cảm dồn nén, nhiều mâu thuẫn sâu',
    spouse_traits: 'Người phối ngẫu ăn nói giỏi, hay ghen, trọng thể diện, đôi khi quá khắt khe, nhưng trong lòng sâu nặng',
    timing: 'Không có ràng buộc riêng, nhưng cần chuẩn bị tâm lý cho việc trao đổi, mài giũa lâu dài',
  },
  '天相': {
    summary: 'Lương duyên “thân càng thêm thân”, chồng xướng vợ họa, hôn nhân kiểu hợp tác',
    good: 'Gặp đủ Phụ Bật: tình cảm trung thành, hôn nhân vững; người phối ngẫu chính trực, thực tế; Thiên Tướng tam hợp gặp Lộc: tiền lộc có thể trông đợi',
    bad: 'Chỉ có một trong Phụ Bật: có thể báo hiệu tái hôn; gặp nhiều sát: trong tình cảm dồn nén ấm ức, không giỏi bày tỏ',
    spouse_traits: 'Người phối ngẫu chính trực thực tế, giữ chữ tín, không thích xung đột, giỏi dung hòa, là bạn đời rất tốt',
    timing: 'Phần nhiều phát triển từ quan hệ quen biết như bạn học, đồng nghiệp, hàng xóm; vợ chồng nên cùng hợp tác làm việc',
  },
  '天梁': {
    summary: 'Hợp người phối ngẫu có tinh thần trách nhiệm cao hoặc lớn tuổi hơn; trước khi cưới nhiều trắc trở',
    good: 'Gặp Lộc: người phối ngẫu có phúc đức, tình cảm thực tế; tam hợp có cát: tình cảm được vun đắp chín chắn lý trí',
    bad: 'Hóa Kỵ hoặc gặp sát: hay cằn nhằn, cố thuyết phục áp đặt, tình cảm xa cách; Thiên Lương phối Thiên Mã: vợ chồng vì hoàn cảnh mà phân tán; trước khi cưới dễ thất bại mối tình đầu',
    spouse_traits: 'Người phối ngẫu trách nhiệm cao, chín chắn già dặn, giỏi nói lý lẽ, nhưng đôi khi có xu hướng giảng giải dạy đời',
    timing: 'Trước khi cưới nhiều trắc trở là chuyện thường, một khi đã cưới lại vững; không có sát thì sau cưới tình duyên càng sâu',
  },
  '七杀': {
    summary: '“Uyên khâm bán lãnh” (chăn uyên ương lạnh một nửa) — gần ít xa nhiều, nên cưới muộn sau 30 tuổi',
    good: 'Miếu vượng (cung Dần, Thân): người phối ngẫu tuy cứng rắn nhưng trung thành, đã dấn thân thì hết lòng; có Hóa Lộc giúp: giảm cô khắc',
    bad: 'Gặp sát: tình cảm bề ngoài hòa thuận mà trong lòng bất mãn, mệnh nam chủ lấy vợ hai; mệnh nữ hợp làm vợ lẽ, vợ kế; cung Mão, Dậu (Vũ Khúc Thất Sát): vận hôn nhân xấu nhất',
    spouse_traits: 'Người phối ngẫu cứng rắn cô độc, yêu từ cái nhìn đầu tiên nhanh mà rời đi cũng nhanh, nóng lạnh trong tình yêu đều nhanh',
    timing: 'Đều nên cưới muộn, sau 30 tuổi hôn nhân khá vững; cưới sớm nhiều hình khắc',
    ni_quote: 'Thất Sát ở cung phu phụ thì chăn uyên ương lạnh một nửa (phú cổ); nếu anh lấy một người vợ có Thất Sát nhập Mệnh thì coi như anh hỏng mất một nửa rồi, rất mệt, lúc nào cũng nơm nớp như thấy giặc',
  },
  '破军': {
    summary: 'Sao phá hao của hôn nhân, không sao vượt qua được; theo đuổi tình cảm không ràng buộc',
    good: 'Hóa Lộc: phá rồi mới lập, tình cảm qua nhiều sóng gió lại có thể đi đến cuối; anh tinh nhập miếu: người phối ngẫu anh tuấn có cá tính',
    bad: 'Hóa Kỵ: phá hỏng hết, thường hôn nhân thêm một lần hoặc không cưới; Tử Vi Phá Quân (Sửu, Mùi): không thêm sát cũng khắc, thêm sát ắt ly; với Liêm Trinh: làm mộ dưới nước; sau trung niên có tượng chia giường ở riêng',
    spouse_traits: 'Người phối ngẫu theo đuổi tự do, không thích ràng buộc, dám đột phá, nhưng quan niệm hôn nhân mỏng manh, cả đời biến động lớn',
    timing: 'Trước khi cưới dễ yêu từ cái nhìn đầu tiên hoặc cưới vội; nên kéo dài thời gian tìm hiểu rồi mới quyết định',
    ni_quote: 'Liêm Trinh Phá Quân ở cung Phu Thê là làm mộ dưới nước; Phá Quân là sao có sức phá hoại hôn nhân mạnh nhất',
  },
};

// ─── 四化在夫妻宫的完整断语 ───────────────────────────────

export const SIHUA_IN_FUQI_GU = {
  '化禄': 'Có duyên bẩm sinh với người phối ngẫu, người phối ngẫu tính lạc quan, sau cưới tình cảm càng tốt, người phối ngẫu càng ngày càng kiếm được tiền, duyên phận sâu dày; tự hóa Lộc thì tiền đến rồi đi, có tình cảm nhưng khó giữ',
  '化权': 'Hôn nhân phần nhiều do chủ động giành lấy, người phối ngẫu nắm quyền quyết định, phần lớn việc do người phối ngẫu tự quyết, cần học cách buông tay; hôn nhân kiểu giành giật, càng cưỡng cầu càng khó được',
  '化科': 'Được xem là tiểu Lộc, có thể chung sống hòa hợp với người phối ngẫu, có duyên quý nhân, lợi cho yêu đương cưới hỏi; Khoa ở cung Phu Thê chủ người phối ngẫu có danh tiếng hoặc kỹ năng chuyên môn',
  '化忌': 'Mắc nợ hôn nhân, cưới sớm ly sớm, khuyên cưới muộn hoặc không cưới; người phối ngẫu có lời oán trách với bản thân; Hóa Kỵ xung cung Phu Thê càng hung — điềm sinh ly tử biệt',
};

// ─── 合盘核心方法论 ─────────────────────────────────────────

export const HEMING_METHODOLOGY = `
## Khung phân tích hợp lá số cốt lõi (hệ thống Nghê Hải Hạ + tổng hợp 《Tử Vi Đẩu Số toàn thư》)

### 1. Nguyên tắc xét đồng thời hai cung (phép đoán hôn nhân quan trọng nhất của Nghê Hải Hạ)

**Khẩu quyết cốt lõi: “Xem hôn nhân mà chỉ xem cung Phu Thê là sai hoàn toàn, nhất định phải xem đồng thời cung Phúc Đức.”**

- **Cung Phu Thê**: xem tính sao, ngoại hình, tính cách, kiểu tương tác của người phối ngẫu
- **Cung Phúc Đức**: đại diện cho tình cảm sâu xa của vợ chồng, hôn nhân có bền lâu hay không
- **Ví dụ của thầy Nghê**: “Có người cung Phu Thê rất tốt mà cung Phúc Đức rất tệ — tan! Vợ chồng sẽ tan.”

**Vì vậy khi hợp lá số phải phân tích đồng thời của cả hai bên: cung Mệnh + cung Phu Thê + cung Phúc Đức**

---

### 2. Tiêu chuẩn đánh giá “trời tác hợp”

**Mức hợp cao nhất (trời tác hợp)**:
- Chính tinh cung Phu Thê của bên A = chính tinh cung Mệnh của bên B
- Chính tinh cung Phu Thê của bên B = chính tinh cung Mệnh của bên A
- Hai bên tương ứng lẫn nhau thì là một cặp định sẵn trong số mệnh

**Mức đẹp đôi thứ cấp**:
- Chính tinh cung Phu Thê của một bên = chính tinh cung Mệnh của bên kia (tương ứng một chiều)
- Ngũ hành tính sao cung Mệnh hai bên tương sinh (như mệnh Mộc với mệnh Thổ, mệnh Thổ với mệnh Thủy)
- Đại hạn hai bên cùng đi vận vượng

**Tổ hợp điềm xấu**:
- Hai bên cùng Hóa Kỵ xung cung Mệnh của nhau (oan gia của nhau)
- Hóa Kỵ của một bên bay vào cung Phu Thê của bên kia (gây tổn thương hôn nhân cho bên kia)
- Cung Phu Thê của cả hai bên đều có sát nặng mà không có cát tinh

---

### 3. Phép hợp lá số năm bước đầy đủ

**Bước 1: Đánh giá nền tảng mệnh cách hai bên**
- Cách cục cung Mệnh hai bên có xứng nhau không (cùng loại hay bổ sung cho nhau)
- Trọng điểm: sự phối hợp tính sao của cung Mệnh + cung Thân + cung Phúc Đức
- Cảnh báo: cả hai đều là cách Sát Phá Tham (hai hổ tranh nhau); hoặc một mạnh một yếu chênh lệch quá xa

**Bước 2: Xét chéo cung Phu Thê**
- Chính tinh cung Phu Thê của bên A → có tương ứng với sao ở cung Mệnh/tam hợp của bên B không?
- Chính tinh cung Phu Thê của bên B → có tương ứng với sao ở cung Mệnh/tam hợp của bên A không?
- Trạng thái Tứ Hóa của cung Phu Thê mỗi bên (Hóa Lộc/Hóa Kỵ ảnh hưởng lớn nhất)

**Bước 3: Phân tích tượng sao Thái Dương, Thái Âm**
- Mệnh nữ: Thái Dương đại diện cho chồng; Thái Dương miếu vượng = vượng phu, lạc hãm Hóa Kỵ = khắc phu
- Mệnh nam: Thái Âm đại diện cho vợ; Thái Âm miếu vượng = vợ đẹp hiền, Hóa Kỵ = mẹ chồng nàng dâu bất hòa
- Trạng thái của hai sao này trên lá số hai bên ảnh hưởng trực tiếp đến chất lượng hôn nhân

**Bước 4: Xét chéo phi hóa Tứ Hóa (kỹ thuật nâng cao)**
- Can năm sinh của bên A → tìm sao Tứ Hóa → các sao này rơi vào cung nào trên lá số bên B
  - Hóa Lộc bay vào cung Mệnh/Tài Bạch của bên B: giúp ích tích cực cho bên B
  - Hóa Kỵ bay vào cung Phu Thê của bên B: gây tổn thương hôn nhân cho bên B
  - Hóa Kỵ bay vào cung Mệnh của bên B: bản thân gây áp lực cho đối phương
- Can năm sinh của bên B → phân tích phi hóa ngược lại về bên A
- Tạo thành “xét chéo phi hóa”, đánh giá “kiểu duyên phận” hai chiều

**Bước 5: Phân tích đồng bộ đại hạn**
- Đại hạn hiện tại của hai bên có cùng đi vận vượng không: cùng vượng = thời điểm tốt nhất, cùng suy = thách thức chung
- Một bên vượng một bên suy: cần có ý thức cân bằng trạng thái hai bên
- Sao đào hoa tụ ở tam hợp của lưu niên: năm ấy là thời điểm tốt để kết hôn

---

### 4. Đánh giá kiểu duyên phận

| Kiểu hóa duyên | Đặc điểm |
|---------|------|
| Hóa Lộc dẫn động | Chính duyên, tình yêu thật, tình cảm ngọt ngào suôn sẻ |
| Hóa Quyền dẫn động | Tình cảm do chủ động giành lấy, có độ căng, có bên chủ đạo |
| Hóa Khoa dẫn động | Duyên chung sống hòa hợp, tôn trọng lẫn nhau, kiểu bạc đầu giai lão |
| Hóa Kỵ dẫn động | Nghịch duyên/oan gia, hành hạ nhau mà khó rời xa, cần tu dưỡng mới hóa giải được |
| Hai bên cùng Hóa Kỵ vào nhau | Kiểu “oan gia ngõ hẹp”, tình cảm mãnh liệt nhưng đau khổ đi cùng, kiểu nợ từ kiếp trước |

---

### 5. Phép đoán thời điểm cưới ba tầng

**Tầng 1: Cách cục lá số bản mệnh**
- Cung Phu Thê không có sát: nên cưới sớm
- Cung Phu Thê có sát không có cát: nên cưới muộn (nam trên 30, nữ trên 27)
- Vũ Khúc, Liêm Trinh, Thất Sát, Phá Quân ở cung Phu Thê: đều khuyên cưới muộn

**Tầng 2: Đại hạn**
- Cung Phu Thê của đại hạn nhiều cát tinh: mười năm ấy có cơ hội kết hôn
- Cung Phu Thê của đại hạn Hóa Kỵ: mười năm ấy tình cảm bị cản trở

**Tầng 3: Lưu niên**
- Hồng Loan, Thiên Hỷ vào cung Mệnh hoặc cung Phu Thê: năm ấy chuyện yêu đương cưới hỏi có động
- Cung lưu niên rơi vào cung Phu Thê: năm ấy hôn nhân là trọng điểm
- Sao đào hoa hội tụ ở tam hợp của lưu niên: năm ấy nhiều cơ hội tình cảm

---

### 6. Hoàn cảnh kết hôn theo từng cung

| Cung lưu niên | Hoàn cảnh kết hôn |
|---------|---------|
| Cung Phu Thê | Tình cảm phát triển bình thường rồi kết hôn |
| Cung Mệnh | Tự mình chủ động tiến tới kết hôn |
| Cung Tử Tức | Cưới vì có con (có con trước, cưới sau) |
| Cung Điền Trạch | Kết hôn vì lý do gia đình, nhà cửa |
| Cung Phụ Mẫu | Theo lệnh cha mẹ, qua bề trên giới thiệu |

---

### 7. Dấu hiệu cụ thể của khắc phu/khắc thê

**Mệnh khắc phu (không theo nghĩa truyền thống) theo định nghĩa của thầy Nghê**:
> “Cô gái khắc phu là vợ đi phía trước, chồng đi phía sau mồ hôi đầy đầu xách túi lớn túi nhỏ trả tiền, khó khăn lắm mới đợi được xe, chồng còn phải mở cửa cho vợ. Đó gọi là khắc phu.”
> “Vượng phu là người vợ khiến chồng hoàn toàn không phải lo nghĩ việc phía sau.”

**Dấu hiệu cụ thể**:
- Cung Phu Thê có Liêm Trinh + Tham Lang/Phá Quân/Thất Sát (tổ hợp ba hung)
- Thái Dương lạc hãm Hóa Kỵ (mệnh nữ)
- Thái Âm Hóa Kỵ (mệnh nam)
- Cung Phu Thê tụ đủ tứ sát mà không có cát tinh
- Quả Tú, Cô Thần vào cung Mệnh hoặc cung Phu Thê
- Cung Phúc Đức có Phá Quân hãm + Liêm Trinh bình (cách làm mộ dưới nước)

---

### 8. Hợp lá số cho hợp tác sự nghiệp

**Các cung tham khảo chính**:
- Cung Quan Lộc: tính sao cung sự nghiệp hai bên có tương thích không
- Cung Huynh Đệ (cung Nô Bộc): đại diện cho quan hệ hùn hạp
- Cung Phúc Đức: có đồng cam cộng khổ được không

**Điềm tốt khi hợp tác sự nghiệp**:
- Cung Mệnh hai bên bổ sung cho nhau (một người mưu tính, một người thực hiện)
- Hóa Lộc từ cung Quan Lộc của một bên bay vào cung Quan Lộc của bên kia
- Cung Huynh Đệ có Lộc Tồn, không có Hóa Kỵ xung

**Điềm xấu khi hợp tác sự nghiệp**:
- Hóa Kỵ hai bên xung nhau ở cung Quan Lộc
- Hóa Kỵ từ cung Mệnh của đối phương bay vào cung Tài Bạch của mình (đối phương tiêu hao tiền của mình)
- Cự Môn ở cung Huynh Đệ/Nô Bộc: thầy Nghê nói “Cự Môn ở cung bạn bè, nghĩa là hùn hạp với bạn thì bạn thành kẻ thù”

---

### 9. Kiểu tương hợp tình cảm (đoán nhanh độ tương thích mệnh cách)

| Tổ hợp hai bên | Độ tương thích | Giải thích |
|---------|-------|------|
| Tử Vi + Thiên Phủ | ★★★★★ | Đế tinh gặp kho tiền, cùng làm nên cho nhau, ổn định nhất |
| Thiên Tướng + bất kỳ sao nào | ★★★★ | Sao ấn phò tá, Thiên Tướng thích nghi tốt |
| Thiên Lương + Thiên Đồng | ★★★★ | Già dặn và ôn hòa bổ sung nhau, kiểu bạc đầu giai lão |
| Thái Dương + Thái Âm | ★★★★ | Nhật Nguyệt tịnh minh, bổ sung kinh điển, âm dương điều hòa |
| Thất Sát + Thất Sát | ★★ | Hai hổ tranh nhau, tia lửa lớn, nhiều mâu thuẫn |
| Phá Quân + Phá Quân | ★★ | Hai Phá, phá hoại lẫn nhau, hôn nhân không ổn định |
| Liêm Trinh + Thất Sát/Phá Quân | ★ | Hai trong tổ hợp ba hung, nguy cơ sinh ly tử biệt cao nhất |
| Sát Phá Tham + Cơ Nguyệt Đồng Lương | ★★★ | Động tĩnh bổ sung nhau nhưng cần mài giũa, một bên khai phá một bên giữ thành |
| Tử Phá + Liêm Phủ | ★★★★ | Cách cục tương đương, thu hút lẫn nhau |
| Vũ Khúc + Thiên Đồng | ★★★ | Cương nhu tương tế, Vũ Khúc thu liễm gặp Thiên Đồng ôn hòa, bổ sung được cho nhau |

---

### 10. Tổng hợp danh ngôn cốt lõi về hợp lá số của Nghê Hải Hạ

1. **“Xem hôn nhân mà chỉ xem cung Phu Thê là sai hoàn toàn, nhất định phải xem đồng thời cung Phúc Đức.”**
2. **“Liêm Trinh Tham Lang/Liêm Trinh Phá Quân ở cung Phu Thê, bất kể mệnh nam hay nữ, không sinh ly thì tử biệt.”**
3. **“Liêm Trinh Thất Sát — chôn thây giữa đường; Liêm Trinh Phá Quân — làm mộ dưới nước; Liêm Trinh Tham Lang — hoạnh yểu chết yểu.”**
4. **“Thái Dương Hóa Kỵ, trên không thấy cha, dưới không thấy con, giữa không thấy chồng.” (mệnh nữ mười năm ấy người phối ngẫu gặp tai nạn lớn)**
5. **“Mệnh của đàn ông sợ nhất Thái Âm Hóa Kỵ: mẹ chồng nàng dâu bất hòa, vợ với mẹ nhất định không hợp.”**
6. **“Vượng phu là người vợ khiến chồng hoàn toàn không phải lo nghĩ việc phía sau; khắc phu là tình cảm quá tốt, hoàn toàn lấy đối phương làm chính.”**
7. **“Cự Môn ở cung bạn bè, hùn hạp với bạn thì bạn thành kẻ thù.”**
8. **“Nếu anh lấy một người vợ có Thất Sát nhập Mệnh thì coi như anh hỏng mất một nửa rồi, rất mệt, lúc nào cũng nơm nớp như thấy giặc.”**
`;

// ─── 婚姻判断辅助表 ─────────────────────────────────────────

export const MARRIAGE_STARS_BRIEF: Record<string, string> = {
  '红鸾': 'Chính duyên yêu đương cưới hỏi; vào Mệnh, Thân chủ chủ động thành hôn; lưu niên gặp Hồng Loan thì năm ấy chuyện cưới hỏi có động',
  '天喜': 'Hỷ sự cưới hỏi, cùng Hồng Loan dẫn động lẫn nhau, chủ việc vui đến',
  '天姚': 'Đào hoa tài nghệ, cơ hội tình cảm; trong yêu đương gặp Thiên Diêu dễ có cuộc gặp gỡ lãng mạn',
  '咸池': 'Đào hoa mạnh, chú ý rắc rối tình cảm; gặp Tham Lang thì đào hoa vượng nhất',
  '孤辰': 'Sao cô khắc; mệnh nam vào cung Mệnh chủ độc lập tốt, nhưng vào cung Phu Thê chủ duyên mỏng',
  '寡宿': 'Sao cô khắc; mệnh nữ vào Mệnh hoặc cung Phu Thê chủ hôn nhân không thuận, gần ít xa nhiều',
  '天哭': 'Cô khắc hình thương; vào cung Phu Thê chủ người phối ngẫu có tai họa lớn',
  '天虚': 'Sao hao hụt; vào cung Phu Thê chủ tình cảm hao mòn',
  '天巫': 'Cưới muộn, di sản, tôn giáo; vào cung Phu Thê chủ cưới muộn là tốt, cưới sớm nhiều trắc trở',
};

export const HEMING_SCORE_CRITERIA = {
  '五星': 'Cung Phu Thê hai bên phản chiếu nhau, trời tác hợp, Tứ Hóa bổ ích cho nhau, đại hạn cùng đi vận vượng, cung Phúc Đức cả hai đều cát',
  '四星': 'Cung Phu Thê một bên tương ứng cung Mệnh bên kia, Tứ Hóa chủ yếu là Lộc và Khoa, nền tảng tình cảm vững chắc',
  '三星': 'Mệnh cách xứng nhau nhưng mỗi người đều có góc cạnh, cần mài giũa, về lâu dài ổn định',
  '二星': 'Cung Phu Thê mỗi bên đều có sát tinh, Hóa Kỵ có xung, tình cảm lên xuống lớn, cần cả hai chủ động vun đắp',
  '一星': 'Hung tinh tụ ở cung Phu Thê, hoặc tổ hợp ba hung của Liêm Trinh, nguy cơ sinh ly tử biệt cao',
};
