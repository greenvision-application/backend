import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PlantRecommendationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Gợi ý cây tương tự dựa trên các cây người dùng đã lưu
   * @param userId ID của người dùng cần gợi ý
   * @param limit Số lượng cây tối đa muốn gợi ý (mặc định: 5)
   * @returns Danh sách cây được gợi ý hoặc mảng rỗng nếu không tìm thấy
   */
  async recommendSimilarPlants(userId: string, limit: number = 6) {
    // Lấy danh sách cây hiện tại của user
    const userPlants = await this.prisma.user_Plant.findMany({
      where: {
        user_id: userId,
      },
      include: {
        Plant: {
          include: {
            Category: true,
          },
        },
      },
    });

    // Nếu user chưa có cây nào, trả về mảng rỗng
    if (!userPlants || userPlants.length === 0) {
      return [];
    }

    // Lấy danh sách các ID cây user đã có để loại trừ khỏi kết quả gợi ý
    const existingPlantIds = userPlants.map((up) => up.plant_id);

    // Phân tích thông tin cây hiện có để xác định sở thích của user
    const preferences = {
      categories: new Map<string, number>(),
      soilTypes: new Map<string, number>(),
      sites: new Map<string, number>(),
      difficultyLevels: new Map<string, number>(),
      lightRequirements: new Map<string, number>(),
      humidityRanges: new Map<string, number>(),
      temperatureRanges: [] as Array<{ min: number; max: number }>,
    };

    // Tính toán trọng số cho các thuộc tính dựa trên cây hiện có và đánh dấu yêu thích
    userPlants.forEach((up) => {
      const plant = up.Plant;
      const weight = up.favorite ? 2 : 1; // Cây được yêu thích có trọng số cao hơn

      // Tăng điểm cho từng thuộc tính
      incrementMapValue(preferences.categories, plant.category_id, weight);
      incrementMapValue(preferences.soilTypes, plant.soil_type, weight);
      incrementMapValue(preferences.sites, plant.habitatLocation, weight);
      incrementMapValue(
        preferences.difficultyLevels,
        plant.difficulty_level,
        weight,
      );
      incrementMapValue(
        preferences.lightRequirements,
        plant.lightRequirement,
        weight,
      );
      incrementMapValue(
        preferences.humidityRanges,
        plant.humidityRange,
        weight,
      );

      // Lưu khoảng nhiệt độ
      preferences.temperatureRanges.push({
        min: plant.minTemperature,
        max: plant.maxTemperature,
      });
    });

    // Xác định các giá trị ưa thích nhất của user
    const topCategory = getTopPreference(preferences.categories);
    const topSoilType = getTopPreference(preferences.soilTypes);
    const topSite = getTopPreference(preferences.sites);
    const topDifficulty = getTopPreference(preferences.difficultyLevels);
    const topLight = getTopPreference(preferences.lightRequirements);
    const topHumidity = getTopPreference(preferences.humidityRanges);

    // Tính trung bình khoảng nhiệt độ
    const avgTempRange =
      preferences.temperatureRanges.length > 0
        ? {
            min:
              preferences.temperatureRanges.reduce(
                (sum, range) => sum + range.min,
                0,
              ) / preferences.temperatureRanges.length,
            max:
              preferences.temperatureRanges.reduce(
                (sum, range) => sum + range.max,
                0,
              ) / preferences.temperatureRanges.length,
          }
        : { min: 0, max: 30 };

    // Tìm các cây tiềm năng (không bao gồm những cây user đã có)
    const potentialPlants = await this.prisma.plant.findMany({
      where: {
        id: {
          notIn: existingPlantIds,
        },
        // Thêm điều kiện approved_content nếu cần thiết
        approved_content: true,
      },
      include: {
        Category: true,
      },
    });

    // Nếu không có cây tiềm năng nào, trả về mảng rỗng
    if (potentialPlants.length === 0) {
      return [];
    }

    // Tính điểm tương đồng cho mỗi cây tiềm năng
    const scoredPlants = potentialPlants.map((plant) => {
      let score = 0;

      // Tính điểm dựa trên sự tương đồng với sở thích của user
      if (plant.category_id === topCategory) score += 3;
      if (plant.soil_type === topSoilType) score += 2;
      if (plant.habitatLocation === topSite) score += 2;
      if (plant.difficulty_level === topDifficulty) score += 1.5;
      if (plant.lightRequirement === topLight) score += 1.5;
      if (plant.humidityRange === topHumidity) score += 1;

      // Tính điểm dựa trên sự phù hợp về nhiệt độ
      const tempOverlap =
        Math.min(plant.maxTemperature, avgTempRange.max) -
        Math.max(plant.minTemperature, avgTempRange.min);
      if (tempOverlap > 0) {
        score += tempOverlap / 10; // Điều chỉnh trọng số cho phù hợp
      }

      // Tính điểm dựa trên kích thước trưởng thành
      // (Giả sử user thích cây có kích thước tương tự)
      const avgSize =
        userPlants.reduce((sum, up) => {
          return sum + (up.Plant.minMatureSize + up.Plant.maxMatureSize) / 2;
        }, 0) / userPlants.length;

      const plantAvgSize = (plant.minMatureSize + plant.maxMatureSize) / 2;
      const sizeDiff = Math.abs(plantAvgSize - avgSize);

      // Cây có kích thước gần với kích thước trung bình được ưu tiên hơn
      if (sizeDiff < 5) score += 1;

      return {
        ...plant,
        similarityScore: score,
      };
    });

    // Sắp xếp theo điểm tương đồng giảm dần và lấy số lượng theo limit
    const recommendations = scoredPlants
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

    // Nếu không có kết quả phù hợp (điểm quá thấp), trả về mảng rỗng
    if (recommendations.length > 0 && recommendations[0].similarityScore < 1) {
      return [];
    }

    return recommendations;
  }
}

// Hàm helper tăng giá trị trong Map
function incrementMapValue(
  map: Map<string, number>,
  key: string,
  increment: number,
) {
  map.set(key, (map.get(key) || 0) + increment);
}

// Hàm helper lấy key có giá trị cao nhất từ Map
function getTopPreference(map: Map<string, number>): string | null {
  if (map.size === 0) return null;

  let topKey = null;
  let topValue = -1;

  map.forEach((value, key) => {
    if (value > topValue) {
      topValue = value;
      topKey = key;
    }
  });

  return topKey;
}
