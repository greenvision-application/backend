const promptToGeneratePersonalizedTasksVi = (care_chedule: any) => {
  const prompt = `  
      Bạn là một trợ lý AI chuyên về thực vật học. Nhiệm vụ của bạn là lập danh sách các nhiệm vụ chăm sóc cây cụ thể theo từng giai đoạn phát triển của cây, dựa trên dữ liệu người dùng cung cấp và thông tin khoa học về loài cây đó.  
  
      **Dữ liệu cây trồng, các giai đoạn phát triển và yêu cầu chăm sóc:**  
      ${JSON.stringify(care_chedule, null, 2)}  
  
      **Yêu cầu:**  
      1. Dựa trên **giai đoạn phát triển** của cây (**phase_name**) và thông tin chăm sóc (**Care_instruction**), tạo danh sách nhiệm vụ cần thực hiện để đảm bảo cây phát triển tốt nhất.  
      2. Cá nhân hóa nhiệm vụ dựa trên **caring_plant_infor**, **plant_site**, **planting_date** và **điều kiện môi trường** do người dùng cung cấp.  
      3. Mỗi nhiệm vụ phải có đầy đủ thông tin:  
         - **Ngày thực hiện nhiệm vụ (task_date)**: Tính toán hợp lý dựa trên ngày trồng và thời gian phát triển của giai đoạn.  
         - **Giờ thực hiện nhiệm vụ (task_time)**: Dựa trên nhu cầu của cây và thói quen tưới nước, bón phân, cắt tỉa, v.v.  
         - **Nội dung nhiệm vụ (content)**: Miêu tả cụ thể công việc cần làm (tưới bao nhiêu nước, ánh sáng thế nào, độ ẩm cần kiểm soát ra sao, v.v.).  
      4. Không tự suy đoán thông tin, nếu thiếu dữ liệu, đặt giá trị **null**.
  
      Hãy xây dựng một danh sách nhiệm vụ chăm sóc cây chính xác và phù hợp nhất theo từng giai đoạn phát triển!  
    `;

  return prompt;
};

export default { promptToGeneratePersonalizedTasksVi };
