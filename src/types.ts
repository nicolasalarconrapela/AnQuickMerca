export type Screen = 
  | 'splash'
  | 'onboarding'
  | 'store_selection'
  | 'home'
  | 'list_detail'
  | 'layout_organization'
  | 'active_navigation';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  unit: string;
  category: string;
  image: string;
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
  status: 'pending' | 'completed';
  repeatWeekly?: boolean;
}

export const AVAILABLE_STORES = [
  { id: '1', name: 'Mercadona Sevilla Centro', address: 'Calle San Eloy, 15, 41001 Sevilla' },
  { id: '2', name: 'Mercadona Nervión', address: 'Av. de Eduardo Dato, 64, 41005 Sevilla' },
  { id: '3', name: 'Mercadona Los Remedios', address: 'Calle Arcos, 14, 41011 Sevilla' },
  { id: '4', name: 'Mercadona Triana', address: 'Calle San Jacinto, 45, 41010 Sevilla' },
  { id: '5', name: 'Mercadona Macarena', address: 'Av. de la Cruz Roja, 34, 41009 Sevilla' },
  { id: '6', name: 'Mercadona Santa Justa', address: 'Calle Pablo Picasso, 2, 41018 Sevilla' },
];
