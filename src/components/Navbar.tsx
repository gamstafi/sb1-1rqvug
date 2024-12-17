import { Package, ShoppingCart, BookOpen, Settings } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      active
        ? 'bg-blue-100 text-blue-700'
        : 'hover:bg-gray-100 text-gray-700'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 space-x-4">
          <NavItem
            icon={<Package size={20} />}
            label="Inventaire"
            active={activeTab === 'inventory'}
            onClick={() => onTabChange('inventory')}
          />
          <NavItem
            icon={<ShoppingCart size={20} />}
            label="Transactions"
            active={activeTab === 'transactions'}
            onClick={() => onTabChange('transactions')}
          />
          <NavItem
            icon={<BookOpen size={20} />}
            label="Journal Comptable"
            active={activeTab === 'journal'}
            onClick={() => onTabChange('journal')}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Paramètres"
            active={activeTab === 'settings'}
            onClick={() => onTabChange('settings')}
          />
        </div>
      </div>
    </nav>
  );
}