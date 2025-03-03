import { SchemaType, ObjectSchema, ArraySchema } from '@google/generative-ai';

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

const plantGrowthPhasesSchema: ArraySchema = {
  description:
    'Schema for defining the growth phases of a plant, including phase details and care instructions.',
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      phase_name: {
        type: SchemaType.STRING,
        description: 'Name of the plant growth phase.',
        nullable: false,
      },
      desc: {
        type: SchemaType.STRING,
        description: 'Description of this growth phase.',
        nullable: true,
      },
      size: {
        type: SchemaType.NUMBER,
        description: 'Size of the plant (cm) at this phase.',
        nullable: false,
      },
      duration: {
        type: SchemaType.NUMBER,
        description:
          'Total duration (hours) the plant spends in this growth phase.',
        nullable: false,
      },
      care_instruction: {
        type: SchemaType.OBJECT,
        description: 'Care instructions for this phase.',
        properties: {
          water: {
            type: SchemaType.OBJECT,
            description:
              'Watering schedule and details for the plant in this phase.',
            properties: {
              frequency: {
                type: SchemaType.OBJECT,
                properties: {
                  interval: {
                    type: SchemaType.NUMBER,
                    description: 'Interval between watering sessions.',
                  },
                  unit: {
                    type: SchemaType.STRING,
                    description: 'Unit of time (day, week, month).',
                    enum: ['day', 'week', 'month'],
                  },
                },
                required: ['interval', 'unit'],
              },
              amount: {
                type: SchemaType.NUMBER,
                description: 'Amount of water needed.',
                nullable: false,
              },
              unit: {
                type: SchemaType.STRING,
                description: 'Unit for water measurement (ml, l).',
                enum: ['ml', 'l'],
              },
            },
            required: ['frequency', 'amount', 'unit'],
          },
          sunlight: {
            type: SchemaType.STRING,
            description: 'Sunlight requirement level in this phase.',
            enum: ['NONE', 'VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'],
          },
          moisture: {
            type: SchemaType.STRING,
            description: 'Moisture level needed in this phase for the plant.',
            enum: ['NONE', 'VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'],
          },
          temperature: {
            type: SchemaType.OBJECT,
            description: 'Optimal temperature range (°C).',
            properties: {
              min: {
                type: SchemaType.NUMBER,
                description: 'Minimum temperature in this phase.',
              },
              max: {
                type: SchemaType.NUMBER,
                description: 'Maximum temperature in this phase.',
              },
            },
            required: ['min', 'max'],
          },
          fertilizer: {
            type: SchemaType.OBJECT,
            description: 'Fertilizer application details.',
            properties: {
              type: {
                type: SchemaType.STRING,
                description:
                  'Type of fertilizer used in this phase of the plant.',
              },
              frequency: {
                type: SchemaType.OBJECT,
                properties: {
                  interval: {
                    type: SchemaType.NUMBER,
                    description: 'Interval between fertilization.',
                  },
                  unit: {
                    type: SchemaType.STRING,
                    description: 'Unit of time (day, week, month).',
                    enum: ['day', 'week', 'month'],
                  },
                },
                required: ['interval', 'unit'],
              },
            },
            required: ['type', 'frequency'],
            nullable: false,
          },
          pruning: {
            type: SchemaType.OBJECT,
            description: 'Pruning recommendations.',
            properties: {
              frequency: {
                type: SchemaType.OBJECT,
                properties: {
                  interval: {
                    type: SchemaType.NUMBER,
                    description: 'Interval between pruning sessions.',
                  },
                  unit: {
                    type: SchemaType.STRING,
                    description: 'Unit of time (day, week, month).',
                    enum: ['day', 'week', 'month'],
                  },
                },
                required: ['interval', 'unit'],
              },
              reason: {
                type: SchemaType.STRING,
                description: 'Reason for pruning the plant during this phase',
              },
            },
            required: ['frequency', 'reason'],
            nullable: false,
          },
        },
        required: [
          'water',
          'sunlight',
          'moisture',
          'temperature',
          'fertilizer',
          'pruning',
        ],
      },
    },
    required: ['phase_name', 'size', 'duration', 'care_instruction'],
  },
};

export default { scanImagePlantSchema, plantGrowthPhasesSchema };
