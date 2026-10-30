import {
  ArrowLeftRight, Baby, Banknote, BookOpen, Briefcase, Bus, Car, Coffee, Coins, CreditCard, DollarSign, Droplets,
  Film, Flower2, Fuel, Gamepad2, Gift, GraduationCap, HeartPulse, House, Landmark, Music, Package, PiggyBank,
  Plane, Receipt, Scissors, ShieldCheck, ShoppingBag, ShoppingBasket, ShoppingCart, Smartphone, Smile, Tag,
  TrainFront, TrendingUp, Trophy, User, Utensils, Vault, Wallet, Wrench, Zap, type LucideIcon,
} from 'lucide-react';

/** Icon danh mục và ví được lưu trong DB dưới dạng chuỗi `lu:<khóa>`. */
export const ICONS: Record<string, LucideIcon> = {
  utensils: Utensils, coffee: Coffee, bag: ShoppingBag, basket: ShoppingBasket, cart: ShoppingCart,
  train: TrainFront, bus: Bus, car: Car, fuel: Fuel, home: House, zap: Zap, droplets: Droplets,
  gamepad: Gamepad2, film: Film, music: Music, book: BookOpen, graduation: GraduationCap, plane: Plane,
  heart: HeartPulse, briefcase: Briefcase, gift: Gift, smile: Smile, shield: ShieldCheck, landmark: Landmark,
  trending: TrendingUp, receipt: Receipt, trophy: Trophy, flower: Flower2, scissors: Scissors, wrench: Wrench,
  user: User, phone: Smartphone, package: Package, wallet: Wallet, cash: Banknote, tag: Tag,
  card: CreditCard, piggy: PiggyBank, coins: Coins, vault: Vault, dollar: DollarSign, transfer: ArrowLeftRight, baby: Baby,
};

export const CATEGORY_ICON_KEYS = [
  'coffee', 'utensils', 'bag', 'basket', 'cart', 'train', 'bus', 'car', 'fuel', 'home', 'zap', 'droplets',
  'gamepad', 'film', 'music', 'book', 'graduation', 'plane', 'heart', 'briefcase', 'gift', 'smile', 'shield', 'landmark',
  'trending', 'receipt', 'trophy', 'flower', 'scissors', 'wrench', 'user', 'phone', 'package', 'wallet', 'cash', 'tag',
];
export const WALLET_ICON_KEYS = ['wallet', 'card', 'landmark', 'cash', 'piggy', 'vault', 'coins', 'phone', 'dollar', 'briefcase'];

// Dữ liệu cũ dùng tên Font Awesome (fa-*) hoặc Bootstrap Icons (bi-*)
const LEGACY: Record<string, string> = {
  'fa-utensils': 'utensils', 'fa-bag-shopping': 'bag', 'fa-train': 'bus', 'fa-bus': 'bus', 'fa-car': 'car',
  'fa-house': 'home', 'fa-gamepad': 'gamepad', 'fa-briefcase': 'briefcase', 'fa-gift': 'gift', 'fa-baby-carriage': 'baby',
  'fa-graduation-cap': 'graduation', 'fa-plane': 'plane', 'fa-heart': 'heart', 'fa-wallet': 'wallet',
  'fa-money-bill-wave': 'cash', 'fa-shield-halved': 'shield', 'fa-basket-shopping': 'basket', 'fa-gas-pump': 'fuel',
  'fa-masks-theater': 'film', 'fa-notes-medical': 'heart', 'fa-landmark': 'landmark', 'fa-money-bill-trend-up': 'trending',
  'fa-file-invoice-dollar': 'receipt', 'fa-table-tennis-paddle-ball': 'trophy', 'fa-flower': 'flower', 'fa-tie': 'briefcase',
  'fa-tag': 'tag', 'fa-user': 'user', 'fa-coffee': 'coffee', 'fa-credit-card': 'card', 'fa-building-columns': 'landmark',
  'fa-money-bill-1': 'cash', 'fa-piggy-bank': 'piggy', 'fa-vault': 'vault', 'fa-coins': 'coins',
  'fa-mobile-screen-button': 'phone', 'fa-sack-dollar': 'dollar', 'fa-money-check-dollar': 'cash',
  'fa-hand-holding-dollar': 'cash', 'fa-money-bill-transfer': 'transfer',
  'bi-cup-hot': 'coffee', 'bi-egg-fried': 'utensils', 'bi-bag': 'bag', 'bi-basket': 'basket', 'bi-cart3': 'cart',
  'bi-train-front': 'bus', 'bi-bus-front': 'bus', 'bi-car-front': 'car', 'bi-fuel-pump': 'fuel', 'bi-house': 'home',
  'bi-lightning-charge': 'zap', 'bi-droplet': 'droplets', 'bi-controller': 'gamepad', 'bi-film': 'film',
  'bi-music-note-beamed': 'music', 'bi-book': 'book', 'bi-mortarboard': 'graduation', 'bi-airplane': 'plane',
  'bi-heart-pulse': 'heart', 'bi-briefcase': 'briefcase', 'bi-gift': 'gift', 'bi-emoji-smile': 'smile',
  'bi-shield-check': 'shield', 'bi-bank': 'landmark', 'bi-graph-up-arrow': 'trending', 'bi-receipt': 'receipt',
  'bi-trophy': 'trophy', 'bi-flower1': 'flower', 'bi-scissors': 'scissors', 'bi-tools': 'wrench', 'bi-person': 'user',
  'bi-phone': 'phone', 'bi-box-seam': 'package', 'bi-wallet2': 'wallet', 'bi-cash-stack': 'cash', 'bi-tag': 'tag',
  'bi-credit-card': 'card', 'bi-cash': 'cash', 'bi-piggy-bank': 'piggy', 'bi-safe': 'vault', 'bi-coin': 'coins',
  'bi-currency-dollar': 'dollar', 'bi-cash-coin': 'cash',
};

export const iconKey = (stored?: string | null): string => {
  if (!stored) return 'tag';
  if (stored.startsWith('lu:')) return ICONS[stored.slice(3)] ? stored.slice(3) : 'tag';
  const token = stored.split(/\s+/).find(t => /^(bi|fa)-/.test(t) && t !== 'fa-solid');
  return (token && LEGACY[token]) || 'tag';
};
export const storeIcon = (key: string) => `lu:${key}`;

const NAME_STYLE: Record<string, { key: string; color: string }> = {
  Business: { key: 'briefcase', color: '#F59E0B' }, Gifts: { key: 'gift', color: '#2DD4BF' }, 'Extra Income': { key: 'trending', color: '#34D399' },
  Loan: { key: 'landmark', color: '#FB7185' }, 'Parental Leave': { key: 'baby', color: '#F472B6' }, 'Insurance Payout': { key: 'shield', color: '#60A5FA' },
  Salary: { key: 'wallet', color: '#2DD4BF' }, Other: { key: 'basket', color: '#94A3B8' },
  'Food & Drink': { key: 'utensils', color: '#FB923C' }, Shopping: { key: 'bag', color: '#C084FC' }, Transport: { key: 'bus', color: '#FACC15' },
  Home: { key: 'home', color: '#FB923C' }, 'Bills & Fees': { key: 'receipt', color: '#22D3EE' }, Entertainment: { key: 'film', color: '#FBBF24' },
  Car: { key: 'car', color: '#60A5FA' }, Travel: { key: 'plane', color: '#FB7185' }, 'Family & Personal': { key: 'user', color: '#38BDF8' },
  Healthcare: { key: 'heart', color: '#F87171' }, Education: { key: 'graduation', color: '#818CF8' }, Groceries: { key: 'basket', color: '#F97316' },
  'Sport & Hobbies': { key: 'trophy', color: '#34D399' }, Beauty: { key: 'flower', color: '#E879F9' }, Work: { key: 'briefcase', color: '#94A3B8' },
  Game: { key: 'gamepad', color: '#A78BFA' }, 'Ăn sáng': { key: 'coffee', color: '#F472B6' }, 'Ăn uống': { key: 'utensils', color: '#FB923C' },
};

export function nameStyle(name?: string | null): { key: string; color: string } {
  const fallback = { key: 'tag', color: '#94A3B8' };
  if (!name) return fallback;
  if (NAME_STYLE[name]) return NAME_STYLE[name];
  const k = Object.keys(NAME_STYLE).find(x => x.toLowerCase() === name.toLowerCase());
  return k ? NAME_STYLE[k] : fallback;
}

/** Màu lưu trong DB là màu đậm cho nền sáng; trên nền tối nâng độ sáng để dễ đọc. */
export function glowColor(hex?: string | null, fallback = '#94A3B8'): string {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return fallback;
  const n = parseInt(hex.slice(1), 16);
  let [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  if (lum < 120) { const k = (120 - lum) / 255 + 0.25; r += (255 - r) * k; g += (255 - g) * k; b += (255 - b) * k; }
  return `#${[r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
}

export function Glyph({ name, size = 18, className }: { name?: string | null; size?: number; className?: string }) {
  const Icon = ICONS[iconKey(name)] ?? Tag;
  return <Icon size={size} strokeWidth={1.9} className={className} aria-hidden />;
}
