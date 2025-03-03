import { SchemaType, ObjectSchema } from '@google/generative-ai';

const scanImagePlantSchema: ObjectSchema = {
  description:
    'Schema for identifying a plant from an image and returning its details, including its characteristics, functions, symbolic meanings, and growing conditions.',
  type: SchemaType.OBJECT,
  properties: {
    plant_name: {
      type: SchemaType.STRING,
      description: 'Common name of the plant.',
      nullable: false,
    },
    scientific_name: {
      type: SchemaType.STRING,
      description: 'Scientific name of the plant.',
      nullable: true,
    },
    searchQuery: {
      type: SchemaType.STRING,
      description: 'Search query for finding plant images on Unsplash.',
      nullable: true,
    },
    overview: {
      type: SchemaType.ARRAY,
      description: 'General description or summary about the plant.',
      items: {
        type: SchemaType.STRING,
      },
    },
    characteristic: {
      type: SchemaType.ARRAY,
      description: 'Key characteristics of the plant.',
      items: {
        type: SchemaType.STRING,
      },
    },
    function: {
      type: SchemaType.ARRAY,
      description: 'Uses or functions of the plant.',
      items: {
        type: SchemaType.STRING,
      },
    },
    meaning: {
      type: SchemaType.ARRAY,
      description: 'Symbolic meanings of the plant.',
      items: {
        type: SchemaType.STRING,
      },
    },
    soil_type: {
      type: SchemaType.STRING,
      description:
        'Preferred soil type of the plant (SANDY, CLAY, SILT, PEAT, CHALK, LOAM).',
      nullable: true,
    },
    difficulty_level: {
      type: SchemaType.STRING,
      description:
        'Difficulty level for growing the plant (EASY, MEDIUM, HARD, VERY_HARD, EXTREME).',
      nullable: true,
    },
    lightRequirement: {
      type: SchemaType.STRING,
      description:
        'Required light level (NONE, VERY_LOW, LOW, MEDIUM, HIGH, VERY_HIGH).',
      nullable: true,
    },
    humidityRange: {
      type: SchemaType.STRING,
      description:
        'Optimal humidity level (NONE, VERY_LOW, LOW, MEDIUM, HIGH, VERY_HIGH).',
      nullable: true,
    },
    minTemperature: {
      type: SchemaType.NUMBER,
      description: 'Minimum temperature (°C) the plant can tolerate.',
      nullable: true,
    },
    maxTemperature: {
      type: SchemaType.NUMBER,
      description: 'Maximum temperature (°C) the plant can tolerate.',
      nullable: true,
    },
    minMatureSize: {
      type: SchemaType.NUMBER,
      description: 'Minimum mature size (cm) of the plant.',
      nullable: true,
    },
    maxMatureSize: {
      type: SchemaType.NUMBER,
      description: 'Maximum mature size (cm) of the plant.',
      nullable: true,
    },
    habitatLocation: {
      type: SchemaType.STRING,
      description:
        'Ideal habitat location for the plant (INDOOR, OUTDOOR, BALCONY, GARDEN, GREENHOUSE, WINDOW_SILL, KITCHEN, BATHROOM, TERRACE, OFFICE, HYDROPONICS, WALL_PLANTER).',
      nullable: true,
    },
  },
  required: [
    'plant_name',
    'overview',
    'characteristic',
    'function',
    'meaning',
    'soil_type',
    'searchQuery',
    'difficulty_level',
    'lightRequirement',
    'humidityRange',
    'minTemperature',
    'maxTemperature',
    'minMatureSize',
    'maxMatureSize',
    'habitatLocation',
  ],
};

export default { scanImagePlantSchema };
