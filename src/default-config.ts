import type { NexusEnergyCardConfig } from "./types";

export const EMPTY_CONFIG: NexusEnergyCardConfig = {
  type: "custom:nexus-energy-card",
  title: "Nexus Energy",
  mode: "power",
  range: "today",
  show_time_selector: true,
  height: 720,
  animation: true,
  animation_speed: 1,
  line_width_base: 2,
  background_style: "glass",
  hide_zero_nodes: false,
  base_color: "#38a5ff",
  default_expanded_depth: 2,
  thresholds: {
    warning: 0.65,
    critical: 0.85
  },
  sources: [],
  nodes: []
};

export const DEFAULT_CONFIG: NexusEnergyCardConfig = {
  title: "Nexus Energy",
  mode: "power",
  range: "today",
  show_time_selector: true,
  height: 720,
  animation: true,
  animation_speed: 1,
  line_width_base: 2,
  background_style: "glass",
  hide_zero_nodes: false,
  base_color: "#38a5ff",
  default_expanded_depth: 2,
  thresholds: {
    warning: 0.65,
    critical: 0.85
  },
  sources: [
    {
      id: "solar",
      name: "Solar",
      entity: "sensor.solar_power",
      power_entity: "sensor.solar_power",
      energy_entity: "sensor.solar_energy_today",
      icon: "mdi:white-balance-sunny",
      capacity: 7
    },
    {
      id: "battery",
      name: "Batería",
      entity: "sensor.battery_power",
      power_entity: "sensor.battery_power",
      energy_entity: "sensor.battery_energy_today",
      icon: "mdi:battery-charging-60",
      capacity: 3,
      direction: "auto"
    },
    {
      id: "grid",
      name: "Red eléctrica",
      entity: "sensor.grid_power",
      power_entity: "sensor.grid_power",
      energy_entity: "sensor.grid_energy_today",
      icon: "mdi:transmission-tower",
      capacity: 6
    },
    {
      id: "generator",
      name: "Generador",
      entity: "sensor.generator_power",
      power_entity: "sensor.generator_power",
      energy_entity: "sensor.generator_energy_today",
      icon: "mdi:engine",
      capacity: 5
    }
  ],
  nodes: [
    {
      id: "home",
      name: "Casa",
      entity: "sensor.home_power",
      power_entity: "sensor.home_power",
      energy_entity: "sensor.home_energy_today",
      icon: "mdi:home-outline",
      capacity: 6,
      children: [
        {
          id: "ground-floor",
          name: "Planta Baja",
          entity: "sensor.ground_floor_power",
          power_entity: "sensor.ground_floor_power",
          energy_entity: "sensor.ground_floor_energy_today",
          icon: "mdi:office-building-marker-outline",
          capacity: 3.5,
          children: [
            {
              id: "living-room",
              name: "Salón",
              entity: "sensor.living_room_power",
              power_entity: "sensor.living_room_power",
              energy_entity: "sensor.living_room_energy_today",
              icon: "mdi:sofa-outline",
              capacity: 1.3
            },
            {
              id: "kitchen",
              name: "Cocina",
              entity: "sensor.kitchen_power",
              power_entity: "sensor.kitchen_power",
              energy_entity: "sensor.kitchen_energy_today",
              icon: "mdi:pot-steam-outline",
              capacity: 1.4,
              children: [
                {
                  id: "oven",
                  name: "Horno",
                  entity: "sensor.oven_power",
                  power_entity: "sensor.oven_power",
                  energy_entity: "sensor.oven_energy_today",
                  icon: "mdi:stove",
                  capacity: 1.8
                },
                {
                  id: "microwave",
                  name: "Microondas",
                  entity: "sensor.microwave_power",
                  power_entity: "sensor.microwave_power",
                  energy_entity: "sensor.microwave_energy_today",
                  icon: "mdi:microwave",
                  capacity: 0.9
                }
              ]
            },
            {
              id: "bathroom-small",
              name: "Aseo",
              entity: "sensor.small_bathroom_power",
              power_entity: "sensor.small_bathroom_power",
              energy_entity: "sensor.small_bathroom_energy_today",
              icon: "mdi:toilet",
              capacity: 0.6
            }
          ]
        },
        {
          id: "top-floor",
          name: "Planta Alta",
          entity: "sensor.top_floor_power",
          power_entity: "sensor.top_floor_power",
          energy_entity: "sensor.top_floor_energy_today",
          icon: "mdi:office-building-marker-outline",
          capacity: 2.2,
          children: [
            {
              id: "main-bedroom",
              name: "Dormitorio Principal",
              entity: "sensor.main_bedroom_power",
              power_entity: "sensor.main_bedroom_power",
              energy_entity: "sensor.main_bedroom_energy_today",
              icon: "mdi:bed-king-outline",
              capacity: 0.7
            },
            {
              id: "bedroom-2",
              name: "Dormitorio 2",
              entity: "sensor.bedroom_2_power",
              power_entity: "sensor.bedroom_2_power",
              energy_entity: "sensor.bedroom_2_energy_today",
              icon: "mdi:bed-outline",
              capacity: 0.6
            },
            {
              id: "bathroom",
              name: "Baño",
              entity: "sensor.bathroom_power",
              power_entity: "sensor.bathroom_power",
              energy_entity: "sensor.bathroom_energy_today",
              icon: "mdi:bathtub-outline",
              capacity: 0.6
            }
          ]
        }
      ]
    }
  ]
};
