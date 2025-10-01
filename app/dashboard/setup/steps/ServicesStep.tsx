/*
Component Summary: Collects the business service catalog during onboarding.
Steps:
1. Captures service attributes with validation before adding them to the local list.
2. Supports editing inputs, choosing currency, and removing rows with lucide icon buttons.
3. Ensures at least one service is defined before saving to shared setup data and continuing.
Component Dependencies: None
External Libs: react, react-intl, lucide-react
*/

import { useState } from "react";
import { useIntl } from "react-intl";
import { Plus, Trash2 } from "lucide-react";

const ServicesStep = ({ data, updateData, nextStep, prevStep }: any) => {
  const intl = useIntl();
  const [services, setServices] = useState<any[]>(data.services);
  const [newService, setNewService] = useState<any>({
    id: Date.now().toString(),
    name: "",
    duration: 30,
    price: 0,
    currency: "USD",
  });
  const [error, setError] = useState("");

  const handleAddService = () => {
    if (!newService.name) {
      setError(intl.formatMessage({ id: "wizard.step2.serviceRequired", defaultMessage: "Service name is required" }));
      return;
    }

    if (!newService.duration) {
      setError(intl.formatMessage({ id: "wizard.step2.durationRequired", defaultMessage: "Duration is required" }));
      return;
    }

    if (newService.price < 0) {
      setError(intl.formatMessage({ id: "wizard.step2.priceRequired", defaultMessage: "Price must be positive" }));
      return;
    }

    setServices([...services, { ...newService, id: Date.now().toString() }]);
    setNewService({
      id: Date.now().toString(),
      name: "",
      duration: 30,
      price: 0,
      currency: "USD",
    });
    setError("");
  };

  const handleRemoveService = (id: string) => {
    setServices(services.filter((service) => service.id !== id));
  };

  const handleContinue = () => {
    if (services.length === 0) {
      setError(intl.formatMessage({ id: "wizard.step2.noServices", defaultMessage: "Please add at least one service" }));
      return;
    }

    updateData({ services });
    nextStep();
  };

  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "â‚¬" },
    { code: "GBP", symbol: "Â£" },
    { code: "SAR", symbol: "SAR" },
    { code: "AED", symbol: "AED" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          {intl.formatMessage({ id: "wizard.step2.title", defaultMessage: "Add Your Services" })}
        </h2>
        <p className="mt-1 text-gray-600">
          {intl.formatMessage({ id: "wizard.step2.subtitle", defaultMessage: "List the services you provide" })}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5">
            <label htmlFor="serviceName" className="label">
              {intl.formatMessage({ id: "wizard.step2.serviceName", defaultMessage: "Service Name" })}
            </label>
            <input
              id="serviceName"
              type="text"
              className="input w-full"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              placeholder={intl.formatMessage({ id: "wizard.step2.serviceName", defaultMessage: "Service Name" })}
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="duration" className="label">
              {intl.formatMessage({ id: "wizard.step2.duration", defaultMessage: "Duration (min)" })}
            </label>
            <input
              id="duration"
              type="number"
              min="5"
              step="5"
              className="input w-full"
              value={newService.duration}
              onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value, 10) })}
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="price" className="label">
              {intl.formatMessage({ id: "wizard.step2.price", defaultMessage: "Price" })}
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              className="input w-full"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="currency" className="label">
              {intl.formatMessage({ id: "wizard.step2.currency", defaultMessage: "Currency" })}
            </label>
            <select
              id="currency"
              className="input w-full"
              value={newService.currency}
              onChange={(e) => setNewService({ ...newService, currency: e.target.value })}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1 flex items-end">
            <button
              type="button"
              className="btn bg-teal-500 text-white hover:bg-teal-600"
              onClick={handleAddService}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {services.length === 0 ? (
          <div className="rounded-lg border border-gray-200 p-4 text-center text-gray-500">
            {intl.formatMessage({ id: "wizard.step2.noServices", defaultMessage: "No services added yet" })}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {intl.formatMessage({ id: "wizard.step2.serviceName", defaultMessage: "Service Name" })}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {intl.formatMessage({ id: "wizard.step2.duration", defaultMessage: "Duration" })}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {intl.formatMessage({ id: "wizard.step2.price", defaultMessage: "Price" })}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    {intl.formatMessage({ id: "common.actions", defaultMessage: "Actions" })}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">{service.duration} min</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {service.price} {service.currency}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveService(service.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button type="button" className="btn btn-outline" onClick={prevStep}>
          {intl.formatMessage({ id: "common.previous", defaultMessage: "Previous" })}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleContinue}>
          {intl.formatMessage({ id: "common.next", defaultMessage: "Next" })}
        </button>
      </div>
    </div>
  );
};

export default ServicesStep;

