import React, { useEffect, useState } from "react";

export default function Servicios() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/services", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (error) {
        console.error("Error cargando servicios:", error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Servicios</h2>
      <ul className="space-y-2">
        {services.map((s) => (
          <li key={s.id} className="p-4 border rounded shadow">
            <h3 className="font-semibold">{s.name}</h3>
            <p>{s.description}</p>
            <span className="text-blue-600 font-bold">${s.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
