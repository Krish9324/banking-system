import { useEffect, useState } from "react";
import api from "../api.js";

export default function BankerDashboard() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/banker/customers");
        setCustomers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelectCustomer = async (customer) => {
    try {
      const res = await api.get(`/banker/customers/${customer.id}/accounts`);
      setSelectedCustomer(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load customer accounts");
    }
  };

  if (loading) return <p>Loading customers...</p>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="banker-layout">
      <div className="card">
        <h2>Customer Accounts</h2>
        {customers.map((c) => (
          <div
            key={c.id}
            className={`customer-row ${
              selectedCustomer && selectedCustomer.id === c.id ? "selected" : ""
            }`}
            onClick={() => handleSelectCustomer(c)}
          >
            <span>{c.name}</span>
            <span>{c.email}</span>
            <span>{c.accounts.length} accounts</span>
          </div>
        ))}
      </div>

      {selectedCustomer && (
        <div className="card">
          <h2>{selectedCustomer.name}'s Accounts & Transactions</h2>
          {selectedCustomer.accounts.map((account) => (
            <div key={account.id} className="account">
              <div className="account-header">
                <div>
                  <strong>Account #{account.accountNumber}</strong>
                  <div>Balance: {account.balance}</div>
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
        </div>
      )}
    </div>
  );
}


