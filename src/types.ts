export type Screen =
  | "splash"
  | "welcome"
  | "onboarding"
  | "store_selection"
  | "home"
  | "list_detail"
  | "layout_organization"
  | "active_navigation"
  | "map_demo"
  | "store_map";

export interface UserProfile {
  name: string;
  language: "en" | "es";
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  rawHit?: any;
}

export interface ListItem extends Product {
  quantity: number;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  storeName: string;
  date: string;
  items: ListItem[];
  status: "pending" | "completed";
  repetition?: "diaria" | "semanal" | "mensual" | "anual";
}

export interface AisleSection {
  name: string;
  side: "left" | "right";
  categories: string[];
}

export interface Aisle {
  id: string;
  sections: AisleSection[];
}

export interface Store {
  id: string;
  name: string;
  address: string;
  entrances: number;
  layout?: Aisle[];
  lat: number;
  lng: number;
}

export const AVAILABLE_STORES: Store[] = [
  {
    id: "1",
    name: "Mercadona Sevilla Centro",
    address: "Calle San Eloy, 15, 41001 Sevilla",
    entrances: 1,
    lat: 37.3912,
    lng: -5.9984,
  },
  {
    id: "2",
    name: "Mercadona Nervión",
    address: "Av. de Eduardo Dato, 64, 41005 Sevilla",
    entrances: 1,
    lat: 37.3826,
    lng: -5.9745,
  },
  {
    id: "3",
    name: "Mercadona Los Remedios",
    address: "Calle Arcos, 14, 41011 Sevilla",
    entrances: 1,
    lat: 37.3752,
    lng: -5.9989,
  },
  {
    id: "4",
    name: "Mercadona Triana",
    address: "Calle San Jacinto, 45, 41010 Sevilla",
    entrances: 1,
    lat: 37.3842,
    lng: -6.0076,
  },
  {
    id: "5",
    name: "Mercadona Macarena",
    address: "Av. de la Cruz Roja, 34, 41009 Sevilla",
    entrances: 1,
    lat: 37.4042,
    lng: -5.9876,
  },
  {
    id: "6",
    name: "Mercadona Santa Justa",
    address: "Calle Pablo Picasso, 2, 41018 Sevilla",
    entrances: 1,
    lat: 37.3915,
    lng: -5.9752,
  },
  {
    id: "7",
    name: "Mercadona Coria del Río I",
    address: "Av. de Andalucía, s/n, 41100 Coria del Río",
    entrances: 1,
    lat: 37.2885,
    lng: -6.0524,
    layout: [
      {
        id: "1",
        sections: [
          { name: "Frutería", side: "left", categories: ["Fruta y verdura"] },
          {
            name: "Panadería",
            side: "right",
            categories: ["Panadería y pastelería"],
          },
          {
            name: "Bollería",
            side: "right",
            categories: ["Panadería y pastelería"],
          },
        ],
      },
      {
        id: "2",
        sections: [
          { name: "Carnicería", side: "left", categories: ["Carne"] },
          {
            name: "Pescadería",
            side: "right",
            categories: ["Marisco y pescado"],
          },
        ],
      },
    ],
  },
  {
    id: "8",
    name: "Mercadona Coria del Río II",
    address: "Calle Batán, 12, 41100 Coria del Río",
    entrances: 2,
    lat: 37.2852,
    lng: -6.0584,
    layout: [
      {
        id: "1",
        sections: [
          {
            name: "Desayunos",
            side: "left",
            categories: ["Cereales y galletas", "Cacao, café e infusiones"],
          },
          {
            name: "Lácteos",
            side: "right",
            categories: ["Huevos, leche y mantequilla", "Postres y yogures"],
          },
        ],
      },
      {
        id: "2",
        sections: [
          { name: "Limpieza", side: "left", categories: ["Limpieza y hogar"] },
          {
            name: "Higiene",
            side: "right",
            categories: ["Cuidado facial y corporal", "Cuidado del cabello"],
          },
        ],
      },
    ],
  },
];

export interface MapSection {
  id: string;
  label: string;
  category: string;
  icon?: string;
  color: string;
  rect: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface SupermarketMapData {
  map: {
    width: number;
    height: number;
  };
  sections: MapSection[];
}
