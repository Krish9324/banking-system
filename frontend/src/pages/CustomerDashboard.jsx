import { useEffect, useState } from "react";
import api from "../api.js";

function TransactionModal({ account, type, onClose, onUpdated }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = `/customer/accounts/${account.id}/${type.toLowerCase()}`;
      const res = await api.post(endpoint, { amount: Number(amount) });
      onUpdated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>
          {type} - Account {account.accountNumber}
        </h3>
        <p>Available balance: {account.balance}</p>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Amount
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          {error && <div className="error">{error}</div>}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Processing..." : type}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeModal, setActiveModal] = useState(null); // { account, type }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/customer/accounts");
        setAccounts(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load accounts");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleUpdated = (updatedAccount) => {
    setAccounts((prev) => prev.map((a) => (a.id === updatedAccount.id ? updatedAccount : a)));
  };

  if (loading) return <p>Loading accounts...</p>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="card">
      <h2>Your Accounts & Transactions</h2>
      {accounts.map((account) => (
        <div key={account.id} className="account">
          <div className="account-header">
            <div>
              <strong>Account #{account.accountNumber}</strong>
              <div>Balance: {account.balance}</div>
            </div>
            <div className="account-actions">
              <button onClick={() => setActiveModal({ account, type: "Deposit" })}>Deposit</button>
              <button onClick={() => setActiveModal({ account, type: "Withdraw" })}>
                Withdraw
              </button>
            </div>
          </div>
          <div className="transactions">
            <h4>Transactions</h4>
            {account.transactions.length === 0 && <p>No transactions yet.</p>}
            {account.transactions.map((tx) => (
              <div key={tx.id} className="transaction-row">
                <span>{tx.type}</span>
                <span>{tx.amount}</span>
                <span>{new Date(tx.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {activeModal && (
        <TransactionModal
          account={activeModal.account}
          type={activeModal.type}
          onClose={() => setActiveModal(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}


