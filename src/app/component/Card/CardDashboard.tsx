import CardPenjualan from "./CardPenjualan";
import CardStock from "./CardStock";
import CardHabis from "./CardHabis";

const CardDashboard = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Analytics Overview</h2>
        <p className="text-gray-500">Track your key performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardPenjualan />
        <CardStock />
        <CardHabis />
      </div>
    </div>
  );
};

export default CardDashboard;
