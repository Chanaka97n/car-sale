export interface Vehicle {
  id: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  mileage: number;
  price: number;
  monthlyPrice: number;
  fuelType: "Petrol" | "Diesel" | "Hybrid" | "Plug-in Hybrid" | "Electric";
  transmission: "Automatic" | "Manual";
  horsepower: number;
  bodyType: string;
  image: string;
  images?: string[];
  featured?: boolean;
  engineSize?: string;
  doors?: number;
  colour?: string;
  drivetrain?: string;
  seats?: number;
  topSpeed?: number;
  acceleration?: string;
  co2?: number;
  mpg?: number;
  registration?: string;
  previousOwners?: number;
  serviceHistory?: string;
  features?: string[];
  description?: string;
}

export const vehicles: Vehicle[] = [
  {
    id: "1",
    make: "Mercedes-Benz",
    model: "S-Class",
    variant: "S 580 L AMG Line Premium Plus",
    year: 2022,
    mileage: 28450,
    price: 76990,
    monthlyPrice: 1342,
    fuelType: "Petrol",
    transmission: "Automatic",
    horsepower: 503,
    bodyType: "Saloon",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1617469955236-f8dd1a135e72?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=800&fit=crop",
    ],
    featured: true,
    engineSize: "4.0L V8 Biturbo",
    doors: 4,
    colour: "Obsidian Black Metallic",
    drivetrain: "4MATIC AWD",
    seats: 5,
    topSpeed: 155,
    acceleration: "4.4s",
    co2: 256,
    mpg: 25,
    registration: "2022 (72)",
    previousOwners: 1,
    serviceHistory: "Full Mercedes-Benz Service History",
    description: "Stunning Mercedes-Benz S 580 L AMG Line Premium Plus finished in Obsidian Black Metallic with black Nappa leather interior. This flagship saloon combines extraordinary luxury with effortless performance from its 4.0L V8 Biturbo engine. Loaded with every conceivable option including MBUX augmented reality navigation, Burmester 4D surround sound, rear executive seating package and driving assistance package plus.",
    features: [
      "MBUX Infotainment System",
      "Burmester 4D Surround Sound",
      "360° Camera System",
      "Heated & Ventilated Front Seats",
      "Rear Executive Seating Package",
      "Panoramic Sunroof",
      "Head-Up Display",
      "Adaptive Air Suspension",
      "Wireless Charging",
      "Keyless Entry & Start",
      "LED Intelligent Light System",
      "Parking Assist Plus",
      "Active Lane Keeping Assist",
      "Blind Spot Monitoring",
      "Apple CarPlay & Android Auto",
      "Climate Control (4-zone)",
    ],
  },
  {
    id: "2",
    make: "BMW",
    model: "X3",
    variant: "xDrive20d M Sport",
    year: 2023,
    mileage: 19870,
    price: 33490,
    monthlyPrice: 592,
    fuelType: "Diesel",
    transmission: "Automatic",
    horsepower: 190,
    bodyType: "SUV",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
    featured: true,
  },
  {
    id: "3",
    make: "Audi",
    model: "A4",
    variant: "40 TFSI S Line",
    year: 2022,
    mileage: 24310,
    price: 36990,
    monthlyPrice: 652,
    fuelType: "Petrol",
    transmission: "Automatic",
    horsepower: 204,
    bodyType: "Saloon",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop",
    featured: true,
  },
  {
    id: "4",
    make: "Range Rover",
    model: "Sport",
    variant: "D300 HSE Dynamic",
    year: 2023,
    mileage: 17280,
    price: 54990,
    monthlyPrice: 971,
    fuelType: "Diesel",
    transmission: "Automatic",
    horsepower: 300,
    bodyType: "SUV",
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&h=400&fit=crop",
  },
  {
    id: "5",
    make: "Volkswagen",
    model: "Golf R",
    variant: "2.0 TSI 4Motion",
    year: 2022,
    mileage: 16310,
    price: 34990,
    monthlyPrice: 615,
    fuelType: "Petrol",
    transmission: "Automatic",
    horsepower: 320,
    bodyType: "Hatchback",
    image: "https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=600&h=400&fit=crop",
  },
  {
    id: "6",
    make: "Volvo",
    model: "XC60",
    variant: "B4 Plus",
    year: 2023,
    mileage: 21490,
    price: 43990,
    monthlyPrice: 775,
    fuelType: "Hybrid",
    transmission: "Automatic",
    horsepower: 197,
    bodyType: "SUV",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=400&fit=crop",
  },
  {
    id: "7",
    make: "Audi",
    model: "Q5",
    variant: "45 TFSI S Line",
    year: 2023,
    mileage: 14920,
    price: 41990,
    monthlyPrice: 739,
    fuelType: "Petrol",
    transmission: "Automatic",
    horsepower: 265,
    bodyType: "SUV",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&h=400&fit=crop",
  },
  {
    id: "8",
    make: "BMW",
    model: "4 Series",
    variant: "420i M Sport",
    year: 2022,
    mileage: 22750,
    price: 31490,
    monthlyPrice: 554,
    fuelType: "Petrol",
    transmission: "Automatic",
    horsepower: 184,
    bodyType: "Coupe",
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=600&h=400&fit=crop",
  },
  {
    id: "9",
    make: "Mercedes-Benz",
    model: "C-Class",
    variant: "C300e AMG Line",
    year: 2022,
    mileage: 18640,
    price: 28490,
    monthlyPrice: 501,
    fuelType: "Plug-in Hybrid",
    transmission: "Automatic",
    horsepower: 313,
    bodyType: "Saloon",
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&h=400&fit=crop",
  },
];

export const makes = [
  "Audi",
  "BMW",
  "Mercedes-Benz",
  "Range Rover",
  "Volkswagen",
  "Volvo",
  "Porsche",
  "Jaguar",
  "Land Rover",
  "Tesla",
];

export const bodyTypes = [
  "Saloon",
  "SUV",
  "Hatchback",
  "Estate",
  "Coupe",
  "Convertible",
];

export const fuelTypes = [
  "Petrol",
  "Diesel",
  "Hybrid",
  "Plug-in Hybrid",
  "Electric",
];

export const testimonials = [
  {
    id: 1,
    name: "James Mitchell",
    role: "BMW X5 Owner",
    text: "Exceptional service from start to finish. The team at MVA found me the perfect car within my budget. Couldn't be happier with my purchase.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Collins",
    role: "Mercedes C-Class Owner",
    text: "The finance process was incredibly smooth. They explained everything clearly and got me a fantastic rate. Highly recommended!",
    rating: 5,
  },
  {
    id: 3,
    name: "David Thompson",
    role: "Audi Q5 Owner",
    text: "Best car buying experience I've ever had. No pressure sales, transparent pricing, and the part exchange was very fair.",
    rating: 5,
  },
];
