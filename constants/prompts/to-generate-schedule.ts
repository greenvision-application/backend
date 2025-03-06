const promptToGenerateCareScheduleVi = (plantData: any) => {
  const prompt = `
    Bạn là một trợ lý AI chuyên về thực vật học. Nhiệm vụ của bạn là tạo một lịch trình chăm sóc cây hợp lý dựa trên các giai đoạn phát triển và hướng dẫn chăm sóc đã có cá nhân hóa cho từng loại cây.
  
    **Dữ liệu của cây và về các giai đoạn phát triển và hướng dẫn chăm sóc cây:**
    ${JSON.stringify(plantData, null, 2)}

  - **Giải thích về schema**:
    - \`start_date\`: Ngày bắt đầu lịch trình chăm sóc cây (định dạng YYYY-MM-DD) ngày này sẽ được dựa vào thông tin của giai đoạn phát triển cụ thể của cây.
    - \`end_date\`: Ngày kết thúc lịch trình chăm sóc cây (định dạng YYYY-MM-DD).
    - \`tasks\`: Danh sách công việc chăm sóc cây theo từng ngày.
      - \`task_date\`: Ngày thực hiện công việc (định dạng YYYY-MM-DD).
      - \`task_time\`: Giờ thực hiện công việc (định dạng HH:MM, theo 24 giờ).
      - \`content\`: Mô tả chi tiết công việc chăm sóc cây.
  
    **Yêu cầu của bạn:**
    1. Dựa vào các giai đoạn phát triển và các thông tin yêu cầu chăm sóc của từng cây, hãy lập lịch trình chăm sóc chi tiết theo thời gian mà trường duration đề ra(trường duration đang được tính bằng giờ, nên khi bạn cho ra lịch trình hãy đảm bảo hãy tính toán nó). Mỗi giai đoạn phát triển của cây nên có ít nhất là 2 task và nhiều nhất là 20 task (có tính cả task trùng lặp nội dung nhưng không trùng thời gian)
    2. Mỗi công việc trong ngày cần có **thời gian cụ thể** và mô tả rõ ràng.
    3. Nếu có công việc lặp lại như tưới nước hoặc bón phân, hãy đảm bảo thời gian và tần suất hợp lý.
    4. Nếu không có thông tin cho một ngày cụ thể, không cần tạo công việc cho ngày đó.
    5. Định dạng dữ liệu đầu ra phải là **mảng JSON**, mỗi phần tử trong mảng là một ngày trong lịch trình.
    6. Nếu không có dữ liệu cho một trường nào đó, hãy để giá trị null thay vì suy đoán.
    7. Tất cả thông tin trả về phải bằng Tiếng Việt.
  
    Hãy tạo lịch trình chăm sóc cây một cách chi tiết nhất!`;

  return prompt;
};

export default { promptToGenerateCareScheduleVi };
