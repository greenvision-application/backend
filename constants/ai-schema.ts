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
          'Total duration (hours) the plant spends in this growth phase, with a minimum of 24 hours',
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
                    format: 'enum',
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
                format: 'enum',
                description: 'Unit for water measurement (ml, l).',
                enum: ['ml', 'l'],
              },
            },
            required: ['frequency', 'amount', 'unit'],
          },
          sunlight: {
            type: SchemaType.STRING,
            format: 'enum',
            enum: ['NONE', 'VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'],
            description: 'Sunlight requirement level in this phase.',
          },
          moisture: {
            type: SchemaType.STRING,
            format: 'enum',
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
                    format: 'enum',
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
                    format: 'enum',
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

const careScheduleSchema: ArraySchema = {
  description:
    'Schema for scheduling plant care tasks based on plant details and care instructions.',
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    description:
      'Details of the care schedule for a specific plant based on information about the plants growth stages and plant care instructions.',
    properties: {
      start_date: {
        type: SchemaType.STRING,
        description: 'Start date of the care schedule (YYYY-MM-DD).',
        nullable: false,
      },
      phase_name: {
        type: SchemaType.STRING,
        description: 'Name of the plant growth phase.',
        nullable: false,
      },
      desc: {
        type: SchemaType.STRING,
        description: 'A short description of this growth stage.',
        nullable: false,
      },
      end_date: {
        type: SchemaType.STRING,
        description: 'End date of the care schedule (YYYY-MM-DD).',
        nullable: false,
      },
    },
    required: ['start_date', 'end_date', 'phase_name', 'desc'],
  },
};

const tasksSchema: ArraySchema = {
  type: SchemaType.ARRAY,
  description:
    'List of plant care tasks that need to be performed on the schedule.',
  items: {
    type: SchemaType.OBJECT,
    properties: {
      task_date: {
        type: SchemaType.STRING,
        description: 'Date of the task (YYYY-MM-DD).',
        nullable: false,
      },
      task_time: {
        type: SchemaType.STRING,
        description: 'Time to perform the task (HH:MM).',
        nullable: false,
      },
      content: {
        type: SchemaType.STRING,
        description: 'Description of the care task.',
        nullable: false,
      },
    },
    required: ['task_date', 'content', 'task_time'],
  },
};

const plantHealthReportSchema: ObjectSchema = {
  description:
    'Schema for generating a detailed health report of a plant based on an image, providing insights into its condition, potential issues, and care recommendations.',
  type: SchemaType.OBJECT,
  properties: {
    health_report: {
      type: SchemaType.STRING,
      description:
        'A comprehensive text report (60 - 100 words) detailing the plant’s health status, detected symptoms, possible causes, and recommendations for care and treatment.',
      nullable: false,
    },
  },
  required: ['health_report'],
};

export default {
  scanImagePlantSchema,
  plantGrowthPhasesSchema,
  careScheduleSchema,
  tasksSchema,
  plantHealthReportSchema,
};
