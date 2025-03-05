
import { useCustomerForm } from "./CustomerForm/useCustomerForm";
import CustomerFormFields from "./CustomerForm/CustomerFormFields";
import CustomerFormError from "./CustomerForm/CustomerFormError";
import CustomerFormActions from "./CustomerForm/CustomerFormActions";

const AddCustomerForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const {
    customer,
    isSubmitting,
    error,
    handleChange,
    handleSelectChange,
    handleSubmit,
  } = useCustomerForm(onSuccess);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CustomerFormError error={error} />
      
      <CustomerFormFields 
        customer={customer}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
      />
      
      <CustomerFormActions 
        isSubmitting={isSubmitting}
        onCancel={() => {
          if (onSuccess) onSuccess();
        }}
      />
    </form>
  );
};

export default AddCustomerForm;
