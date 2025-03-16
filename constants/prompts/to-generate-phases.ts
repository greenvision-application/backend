const promptToGeneratePhaseVi = (plantName: string, scientificName: string) => {
  const prompt = `
Bạn là một trợ lý AI chuyên về thực vật học. Nhiệm vụ của bạn là tạo ra các giai đoạn phát triển của cây dựa trên tên cây "${plantName}" và tên khoa học "${scientificName}" của cây.

Mỗi loại cây thường có từ 5-7 giai đoạn phát triển chính. Hãy đảm bảo phân tích và cung cấp đầy đủ các giai đoạn quan trọng này.

Bạn cần trả về một mảng JSON chứa các giai đoạn phát triển của cây với các thông tin sau:

- "phase_name": Tên giai đoạn phát triển của cây.
- "desc": Mô tả về giai đoạn phát triển này.
- "size": Kích thước trung bình của cây trong giai đoạn này (cm).
- "duration": Tổng số giờ cây ở trong giai đoạn này, ít nhất là 24 giờ(giờ này được quy đổi từ ngày/tuần/tháng).
- "care_instruction":
  - "water":
    - "frequency": Số lần tưới nước và đơn vị thời gian (ngày, tuần, tháng).
    - "amount": Lượng nước cần tưới cần tưới trong giai đoạn này.
    - "unit": Đơn vị đo lường lượng nước (ml, l).
  - "sunlight": Mức độ ánh sáng cây cần trong giai đoạn này(NONE, VERY_LOW, LOW, MEDIUM, HIGH, VERY_HIGH).
  - "moisture": Mức độ ẩm thích hợp trong giai đoạn này (NONE, VERY_LOW, LOW, MEDIUM, HIGH, VERY_HIGH).
  - "temperature":
    - "min": Nhiệt độ tối thiểu cây chịu được trong giai đoạn này (°C).
    - "max": Nhiệt độ tối đa cây chịu được trong giai đoạn này(°C).
  - "fertilizer":
    - "type": Loại phân bón cần sử dụng.
    - "frequency": Tần suất bón phân
        -"interval": Tần xuất giữa các lần bón phân trong giai đoạn này
        -"unit": Đơn vị cho các lần bón phân (day, week, month)
  - "pruning":
    - "frequency": Tần suất tỉa cây.
        -"interval": Tần xuất giữa các lần cắt tỉa trong giai đoạn này
        -"unit": Đơn vị cho các lần cắt tỉa (day, week, month)
    -"reason": Lý do cho việc cắt tỉa cây trong giai đoạn này

Dữ liệu đầu ra phải đảm bảo đúng định dạng JSON theo schema đã định nghĩa. Nếu không tìm thấy thông tin của một trường nào đó, hãy để trống mảng hoặc giá trị null thay vì trả về thông tin không chính xác.
Tất cả thông tin trả về phải bằng tiếng Việt.`;
  return prompt;
};

const promptToGeneratePhaseEn = (plantName: string, scientificName: string) => {
  const prompt = `
You are an AI assistant specializing in botany. Your task is to generate the growth stages of a plant based on its name "${plantName}" and scientific name "${scientificName}".

Most plants typically go through 5-7 major growth stages. Ensure that you analyze and provide all the essential stages.

You need to return a JSON array containing the plant's growth stages with the following details:

- "phase_name": The name of the plant's growth stage.
- "desc": A description of this growth stage.
- "size": The average size of the plant during this stage (cm).
- "duration": The total time the plant stays in this stage, with a minimum of 24 hours (converted into hours from days/weeks/months).
- "care_instruction":
  - "water":
    - "frequency": The number of times the plant should be watered and the time unit (days, weeks, months).
    - "amount": The amount of water needed during this stage.
    - "unit": The measurement unit of water (ml, l).
  - "sunlight": The level of sunlight required during this stage (NONE, VERY_LOW, LOW, MEDIUM, HIGH, VERY_HIGH).
  - "moisture": The appropriate moisture level for this stage (NONE, VERY_LOW, LOW, MEDIUM, HIGH, VERY_HIGH).
  - "temperature":
    - "min": The minimum temperature the plant can tolerate in this stage (°C).
    - "max": The maximum temperature the plant can tolerate in this stage (°C).
  - "fertilizer":
    - "type": The type of fertilizer to use.
    - "frequency": Fertilization frequency.
      - "interval": The interval between fertilization applications in this stage.
      - "unit": The unit for fertilization frequency (day, week, month).
  - "pruning":
    - "frequency": Pruning frequency.
      - "interval": The interval between pruning sessions in this stage.
      - "unit": The unit for pruning sessions (day, week, month).
    - "reason": The reason for pruning the plant during this stage.

The output data must strictly follow the defined JSON schema. If information for a specific field is unavailable, return an empty array or null instead of inaccurate data.

All output information must be in Vietnamese.`;
  return prompt;
};

export default { promptToGeneratePhaseVi, promptToGeneratePhaseEn };
