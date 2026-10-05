import EnquiryDetails from "../../../components/form/EnquiryDetails";

const ComplaintDetails = () => {
  return (
    <EnquiryDetails
      formType="complaint"
      apiBase="/api"
      listPath="/admin/complaints"
    />
  );
};

export default ComplaintDetails;