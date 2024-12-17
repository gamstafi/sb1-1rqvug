import { useState } from 'react';
import Navbar from './components/Navbar';
import InventoryTable from './components/InventoryTable';
import ProductForm from './components/ProductForm';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import JournalList from './components/JournalList';
import SettingsLayout from './components/settings/SettingsLayout';
import { Product, Transaction, JournalEntry } from './types';
import { createJournalEntries } from './utils/journal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [showProductForm, setShowProductForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    };
    setProducts([...products, newProduct]);
    setShowProductForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleUpdateProduct = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id ? { ...productData, id: p.id } : p
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
      setShowProductForm(false);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
    };

    // Update stock quantity
    const updatedProducts = products.map((product) => {
      if (product.id === transactionData.productId) {
        const quantityChange = transactionData.type === 'purchase' 
          ? transactionData.quantity 
          : -transactionData.quantity;
        return {
          ...product,
          stockQuantity: product.stockQuantity + quantityChange,
        };
      }
      return product;
    });

    // Create journal entries
    const newJournalEntries = createJournalEntries(newTransaction);

    setProducts(updatedProducts);
    setTransactions([...transactions, newTransaction]);
    setJournalEntries([...journalEntries, ...newJournalEntries]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto py-6 px-4">
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Inventaire</h1>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Ajouter un produit
              </button>
            </div>

            {showProductForm ? (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-4">
                  {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                </h2>
                <ProductForm
                  onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                  onCancel={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                  }}
                  initialData={editingProduct || undefined}
                  existingProducts={products}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <InventoryTable
                  products={products}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Nouvelle transaction</h2>
              <TransactionForm
                products={products}
                onSubmit={handleAddTransaction}
                existingTransactions={transactions}
              />
            </div>

            <div className="bg-white rounded-lg shadow">
              <TransactionList
                transactions={transactions}
                products={products}
              />
            </div>
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Journal Comptable</h1>
            </div>

            <div className="bg-white rounded-lg shadow">
              <JournalList entries={journalEntries} />
            </div>
          </div>
        )}

        {activeTab === 'settings' && <SettingsLayout />}
      </main>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;